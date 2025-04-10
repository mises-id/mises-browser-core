const path = require('path')
const { spawn, spawnSync } = require('child_process')
const config = require('./config')
const fs = require('fs-extra')
const crypto = require('crypto')
const l10nUtil = require('./l10nUtil')
const Log = require('./sync/logging')
const assert = require('assert')
const updateUnsafeBuffersPaths = require('./updateUnsafeBuffersPaths.js')

const mergeWithDefault = (options) => {
  return Object.assign({}, config.defaultOptions, options)
}

async function applyPatches() {
  const GitPatcher = require('./gitPatcher')
  Log.progress('Applying patches...')
  // Always detect if we need to apply patches, since user may have modified
  // either chromium source files, or .patch files manually
  const coreRepoPath = config.misesCoreDir
  const patchesPath = path.join(coreRepoPath, 'patches')
  const v8PatchesPath = path.join(patchesPath, 'v8')
  const catapultPatchesPath = path.join(patchesPath, 'third_party', 'catapult')
  const grdPatchesPath = path.join(patchesPath, 'grd_patches')

  const chromiumRepoPath = config.srcDir
  const v8RepoPath = path.join(chromiumRepoPath, 'v8')
  const catapultRepoPath = path.join(chromiumRepoPath, 'third_party', 'catapult')
  const grdRepoPath = chromiumRepoPath

  const chromiumPatcher = new GitPatcher(patchesPath, chromiumRepoPath)
  const v8Patcher = new GitPatcher(v8PatchesPath, v8RepoPath)
  const catapultPatcher = new GitPatcher(catapultPatchesPath, catapultRepoPath)
  const grdPatcher = new GitPatcher(grdPatchesPath, chromiumRepoPath)

  const chromiumPatchStatus = await chromiumPatcher.applyPatches()
  const v8PatchStatus = await v8Patcher.applyPatches()
  const catapultPatchStatus = await catapultPatcher.applyPatches()
  const grdPatchStatus = await grdPatcher.applyPatches()
  // Log status for all patches
  // Differentiate entries for logging
  v8PatchStatus.forEach(s => s.path = path.join('v8', s.path))
  catapultPatchStatus.forEach(
    s => s.path = path.join('third_party', 'catapult', s.path))
  const allPatchStatus =
    chromiumPatchStatus.concat(v8PatchStatus).concat(catapultPatchStatus).concat(grdPatchStatus)
  Log.allPatchStatus(allPatchStatus, 'Chromium')

  const hasPatchError = allPatchStatus.some(p => p.error)
  Log.progress('Done applying patches.')
  // Exit on error in any patch
  if (hasPatchError) {
    Log.error('Exiting as not all patches were successful!')
    process.exit(1)
  }

  await updateUnsafeBuffersPaths()
}

const isOverrideNewer = (original, override) => {
  return (fs.statSync(override).mtimeMs - fs.statSync(original).mtimeMs > 0)
}

const updateFileUTimesIfOverrideIsNewer = (original, override) => {
  if (isOverrideNewer(original, override)) {
    const date = new Date()
    fs.utimesSync(original, date, date)
    console.log(original + ' is touched.')
  }
}

const deleteFileIfOverrideIsNewer = (original, override) => {
  if (fs.existsSync(original) && isOverrideNewer(original, override)) {
    try {
      fs.unlinkSync(original)
      console.log(original + ' has been deleted.')
    } catch (err) {
      console.error('Unable to delete file: ' + original + ' error: ', err)
      process.exit(1)
    }
  }
}

const getAdditionalGenLocation = () => {
  if (config.targetOS === 'android') {
    if (config.targetArch === 'arm64') {
      return 'android_clang_arm'
    } else if (config.targetArch === 'x64') {
      return 'android_clang_x86'
    }
  } else if ((process.platform === 'darwin' || process.platform === 'linux') && config.targetArch === 'arm64') {
    return 'clang_x64_v8_arm64'
  }
  return ''
}

const util = {

  runProcess: (cmd, args = [], options = {}) => {
    Log.command(options.cwd, cmd, args)
    return spawnSync(cmd, args, options)
  },

  run: (cmd, args = [], options = {}) => {
    const { continueOnFail, ...cmdOptions } = options
    const prog = util.runProcess(cmd, args, cmdOptions)
    if (prog.status !== 0) {
      if (!continueOnFail) {
        console.log(prog.stdout && prog.stdout.toString())
        console.error(prog.stderr && prog.stderr.toString())
        process.exit(1)
      }
    }
    return prog
  },

  runGit: (repoPath, gitArgs, continueOnFail = false) => {
    let prog = util.run('git', gitArgs, { cwd: repoPath, continueOnFail })

    if (prog.status !== 0) {
      return null
    } else {
      return prog.stdout.toString().trim()
    }
  },

  runAsync: (cmd, args = [], options = {}) => {
    let { continueOnFail, verbose, ...cmdOptions } = options
    if (verbose) {
      Log.command(cmdOptions.cwd, cmd, args)
    }
    return new Promise((resolve, reject) => {
      const prog = spawn(cmd, args, cmdOptions)
      let stderr = ''
      let stdout = ''
      prog.stderr.on('data', data => {
        stderr += data
      })
      prog.stdout.on('data', data => {
        stdout += data
      })
      prog.on('close', statusCode => {
        const hasFailed = statusCode !== 0
        if (verbose && (!hasFailed || continueOnFail)) {
          console.log(stdout)
          if (stderr) {
            console.error(stderr)
          }
        }
        if (hasFailed) {
          const err = new Error(`Program ${cmd} exited with error code ${statusCode}.`)
          err.stderr = stderr
          err.stdout = stdout
          reject(err)
          if (!continueOnFail) {
            console.log(err.message)
            console.log(stdout)
            console.error(stderr)
            process.exit(1)
          }
          return
        }
        resolve(stdout)
      })
    })
  },


  runGitAsync: function (repoPath, gitArgs, verbose = false, logError = false) {
    return util.runAsync('git', gitArgs, { cwd: repoPath, verbose, continueOnFail: true })
      .catch(err => {
        if (logError) {
          console.error(err.message)
          console.error(`Git arguments were: ${gitArgs.join(' ')}`)
          console.log(err.stdout)
          console.error(err.stderr)
        }
        return Promise.reject(err)
      })
  },

  getGitReadableLocalRef: (repoDir) => {
    return util.runGit(repoDir, ['log', '-n', '1', '--pretty=format:%h%d'], true)
  },

  calculateFileChecksum: (filename) => {
    // adapted from https://github.com/kodie/md5-file
    const BUFFER_SIZE = 8192
    const fd = fs.openSync(filename, 'r')
    const buffer = Buffer.alloc(BUFFER_SIZE)
    const md5 = crypto.createHash('md5')

    try {
      let bytesRead
      do {
        bytesRead = fs.readSync(fd, buffer, 0, BUFFER_SIZE)
        md5.update(buffer.slice(0, bytesRead))
      } while (bytesRead === BUFFER_SIZE)
    } finally {
      fs.closeSync(fd)
    }

    return md5.digest('hex')
  },

  updateBranding: () => {
    console.log('update branding...')
    const chromeComponentsDir = path.join(config.srcDir, 'components')
    const misesComponentsDir = path.join(config.misesCoreDir, 'components')
    const chromeAppDir = path.join(config.srcDir, 'chrome', 'app')
    const misesAppDir = path.join(config.misesCoreDir, 'app')
    const chromeBrowserResourcesDir = path.join(config.srcDir, 'chrome', 'browser', 'resources')
    const misesBrowserResourcesDir = path.join(config.misesCoreDir, 'browser', 'resources')
    const misesAppVectorIconsDir = path.join(config.misesCoreDir, 'components')
    const chromeAndroidJavaStringsTranslationsDir = path.join(config.srcDir, 'chrome', 'browser', 'ui', 'android', 'strings', 'translations')
    const misesAndroidJavaStringsTranslationsDir = path.join(config.misesCoreDir, 'browser', 'ui', 'android', 'strings', 'translations')
    const chromeAndroidTabUiJavaStringsTranslationsDir = path.join(config.srcDir, 'chrome', 'android', 'features', 'tab_ui', 'java', 'strings', 'translations')
    const misesAndroidTabUiJavaStringsTranslationsDir = path.join(config.misesCoreDir, 'android', 'features', 'tab_ui', 'java', 'strings', 'translations')

    let fileMap = new Set();
    const autoGeneratedMisesToChromiumMapping = Object.assign({}, l10nUtil.getAutoGeneratedMisesToChromiumMapping())
    // The following 3 entries we map to the same name, not the chromium equivalent name for copying back
    autoGeneratedMisesToChromiumMapping[path.join(misesAppDir, 'mises_strings.grd')] = path.join(chromeAppDir, 'mises_strings.grd')
    autoGeneratedMisesToChromiumMapping[path.join(misesAppDir, 'settings_mises_strings.grdp')] = path.join(chromeAppDir, 'settings_mises_strings.grdp')
    autoGeneratedMisesToChromiumMapping[path.join(misesComponentsDir, 'components_mises_strings.grd')] = path.join(chromeComponentsDir, 'components_mises_strings.grd')

    Object.entries(autoGeneratedMisesToChromiumMapping).forEach(mapping => fileMap.add(mapping))

    // Copy xtb files for:
    // mises/app/resources/chromium_strings*.xtb
    // mises/app/resources/generated_resoruces*.xtb
    // mises/components/strings/components_chromium_strings*.xtb
    // mises/browser/ui/android/strings/translations/android_chrome_strings*.xtb
    // mises/android/features/tab_ui/java/strings/translations/android_chrome_tab_ui_strings*.xtb
    fileMap.add([path.join(misesAppDir, 'resources'), path.join(chromeAppDir, 'resources')])
    fileMap.add([path.join(misesComponentsDir, 'strings'), path.join(chromeComponentsDir, 'strings')])
    fileMap.add([misesAndroidJavaStringsTranslationsDir, chromeAndroidJavaStringsTranslationsDir])
    fileMap.add([misesAndroidTabUiJavaStringsTranslationsDir, chromeAndroidTabUiJavaStringsTranslationsDir])
    // By overwriting, we don't need to modify some grd files.
    fileMap.add([path.join(misesAppDir, 'theme', 'mises'), path.join(chromeAppDir, 'theme', 'mises')])
    fileMap.add([path.join(misesAppDir, 'theme', 'mises'), path.join(chromeAppDir, 'theme', 'chromium')])
    fileMap.add([path.join(misesAppDir, 'theme', 'default_100_percent', 'mises'), path.join(chromeAppDir, 'theme', 'default_100_percent', 'mises')])
    fileMap.add([path.join(misesAppDir, 'theme', 'default_200_percent', 'mises'), path.join(chromeAppDir, 'theme', 'default_200_percent', 'mises')])
    fileMap.add([path.join(misesAppDir, 'theme', 'default_100_percent', 'mises'), path.join(chromeAppDir, 'theme', 'default_100_percent', 'chromium')])
    fileMap.add([path.join(misesAppDir, 'theme', 'default_200_percent', 'mises'), path.join(chromeAppDir, 'theme', 'default_200_percent', 'chromium')])
    fileMap.add([path.join(misesAppDir, 'theme', 'default_100_percent', 'common'), path.join(chromeAppDir, 'theme', 'default_100_percent', 'common')])
    fileMap.add([path.join(misesAppDir, 'theme', 'default_200_percent', 'common'), path.join(chromeAppDir, 'theme', 'default_200_percent', 'common')])
    fileMap.add([path.join(misesComponentsDir, 'resources', 'default_100_percent'), path.join(chromeComponentsDir, 'resources', 'default_100_percent')])
    fileMap.add([path.join(misesComponentsDir, 'resources', 'default_100_percent', 'mises'), path.join(chromeComponentsDir, 'resources', 'default_100_percent', 'chromium')])
    fileMap.add([path.join(misesComponentsDir, 'resources', 'default_200_percent'), path.join(chromeComponentsDir, 'resources', 'default_200_percent')])
    fileMap.add([path.join(misesComponentsDir, 'resources', 'default_200_percent', 'mises'), path.join(chromeComponentsDir, 'resources', 'default_200_percent', 'chromium')])
    fileMap.add([path.join(misesAppVectorIconsDir, 'vector_icons', 'mises'), path.join(chromeComponentsDir, 'vector_icons', 'mises')])
    // Copy chrome-logo-faded.png for replacing chrome logo of welcome page with mises's on Win8.
    fileMap.add([path.join(misesBrowserResourcesDir, 'chrome-logo-faded.png'), path.join(chromeBrowserResourcesDir, 'chrome-logo-faded.png')])
    fileMap.add([path.join(misesBrowserResourcesDir, 'downloads', 'images', 'incognito_marker.svg'), path.join(chromeBrowserResourcesDir, 'downloads', 'images', 'incognito_marker.svg')])
    fileMap.add([path.join(misesBrowserResourcesDir, 'settings', 'images'), path.join(chromeBrowserResourcesDir, 'settings', 'images')])
    fileMap.add([path.join(misesBrowserResourcesDir, 'signin', 'profile_picker', 'images'), path.join(chromeBrowserResourcesDir, 'signin', 'profile_picker', 'images')])
    // Copy to make our ${branding_path_component}_behaviors.cc
    fileMap.add([path.join(config.misesCoreDir, 'chromium_src', 'chrome', 'installer', 'setup', 'mises_behaviors.cc'),
                 path.join(config.srcDir, 'chrome', 'installer', 'setup', 'mises_behaviors.cc')])
    // Replace webui CSS to use our fonts.
    fileMap.add([path.join(config.misesCoreDir, 'ui', 'webui', 'resources', 'css', 'text_defaults_md.css'),
                 path.join(config.srcDir, 'ui', 'webui', 'resources', 'css', 'text_defaults_md.css')])

    for (const [source, output] of fileMap) {
      if (!fs.existsSync(source)) {
        console.warn(`Warning: The following file-system entry was not found for copying contents to a chromium destination: ${source}. Consider removing the entry from the file-map, or investigating whether the correct source code reference is checked out.`)
        continue
      }

      let sourceFiles = []

      // get all the files if source if a directory
      if (fs.statSync(source).isDirectory()) {
        sourceFiles = util.walkSync(source)
      } else {
        sourceFiles = [source]
      }

      for (const sourceFile of sourceFiles) {
        let destinationFile = path.join(output, path.relative(source, sourceFile))

        // The destination file might be newer when updating chromium so
        // we check for an exact match on the timestamp. We use seconds instead
        // of ms because utimesSync doesn't set the times with ms precision
        if (!fs.existsSync(destinationFile) ||
            Math.floor(new Date(fs.statSync(sourceFile).mtimeMs).getTime() / 1000) !=
            Math.floor(new Date(fs.statSync(destinationFile).mtimeMs).getTime() / 1000)) {
          fs.copySync(sourceFile, destinationFile)
          // can't set the date in the past so update the source file
          // to match the newly copied destionation file
          const date = fs.statSync(destinationFile).mtime
          fs.utimesSync(sourceFile, date, date)
          console.log(sourceFile + ' copied to ' + destinationFile)
        }
      }
    }

    if (process.platform === 'darwin') {
      // Copy proper mac app icon for channel to chrome/app/theme/mac/app.icns.
      // Each channel's app icons are stored in mises/app/theme/$channel/app.icns.
      // With this copying, we don't need to modify chrome/BUILD.gn for this.
      const iconSource = path.join(misesAppDir, 'theme', 'mises', 'mac', config.channel, 'app.icns')
      const iconDest = path.join(chromeAppDir, 'theme', 'mises', 'mac', 'app.icns')
      if (!fs.existsSync(iconDest) ||
          util.calculateFileChecksum(iconSource) != util.calculateFileChecksum(iconDest)) {
        console.log('copy app icon')
        if (fs.existsSync(iconSource)) {
          fs.copySync(iconSource, iconDest)
        } else {
          console.log('skiping', iconSource)
        }
        
      }

      // Copy branding file
      let branding_file_name = 'BRANDING'
      if (config.channel)
        branding_file_name = branding_file_name + '.' + config.channel

      const brandingSource = path.join(misesAppDir, 'theme', 'mises', branding_file_name)
      const brandingDest = path.join(chromeAppDir, 'theme', 'mises', 'BRANDING')
      if (!fs.existsSync(brandingDest) ||
          util.calculateFileChecksum(brandingSource) != util.calculateFileChecksum(brandingDest)) {
        console.log('copy branding file')

        if (fs.existsSync(brandingSource)) {
          fs.copySync(brandingSource, brandingDest)
        } else {
          console.log('skiping', brandingSource)
        }
      }
    }
    if (config.targetOS === 'android') {

      let misesOverwrittenFiles = new Set();
      const removeUnlistedAndroidResources = (misesOverwrittenFiles) => {
        const suspectedDir = path.join(config.srcDir, 'chrome', 'android', 'java', 'res')

        let untrackedChromiumFiles = util.runGit(suspectedDir, ['ls-files', '--others', '--exclude-standard'], true).split('\n')
        let untrackedChromiumPaths = [];
        for (const untrackedChromiumFile of untrackedChromiumFiles) {
          untrackedChromiumPath = path.join(suspectedDir, untrackedChromiumFile)

          if (!fs.statSync(untrackedChromiumPath).isDirectory()) {
            untrackedChromiumPaths.push(untrackedChromiumPath);
          }
        }

        const isChildOf = (child, parent) => {
          const relative = path.relative(parent, child);
          return relative && !relative.startsWith('..') && !path.isAbsolute(relative);
        }

        for (const untrackedChromiumPath of untrackedChromiumPaths) {
          if (isChildOf(untrackedChromiumPath, suspectedDir) && !misesOverwrittenFiles.has(untrackedChromiumPath)) {
            fs.removeSync(untrackedChromiumPath);
            console.log(`Deleted not listed file: ${untrackedChromiumPath}`);
          }
        }
      }

      let androidIconSet = ''
      if (config.channel === 'development') {
        androidIconSet = 'res_mises_default'
      } else if (config.channel === '') {
        androidIconSet = 'res_mises'
      } else if (config.channel === 'beta') {
        androidIconSet = 'res_mises_beta'
      } else if (config.channel === 'dev') {
        androidIconSet = 'res_mises_dev'
      } else if (config.channel === 'nightly') {
        androidIconSet = 'res_mises_nightly'
      }

      const androidTranslateResSource = path.join(config.misesCoreDir, 'components', 'translate','content' , 'android', 'java', 'res')
      const androidTranslateResDest = path.join(config.srcDir, 'components', 'translate','content' , 'android', 'java', 'res')
      const androidIconSource = path.join(misesAppDir, 'theme', 'mises', 'android', androidIconSet)
      const androidIconDest = path.join(config.srcDir, 'chrome', 'android', 'java', 'res_chromium')
      const androidIconBaseSource = path.join(misesAppDir, 'theme', 'mises', 'android', androidIconSet + '_base')
      const androidIconBaseDest = path.join(config.srcDir, 'chrome', 'android', 'java', 'res_chromium_base')
      const androidResSource = path.join(config.misesCoreDir, 'android', 'java', 'res')
      const androidResDest = path.join(config.srcDir, 'chrome', 'android', 'java', 'res')
      const androidResTemplateSource = path.join(config.misesCoreDir, 'android', 'java', 'res_template')
      const androidResTemplateDest = path.join(config.srcDir, 'chrome', 'android', 'java', 'res_template')
      const androidContentPublicResSource = path.join(config.misesCoreDir, 'content', 'public', 'android', 'java', 'res')
      const androidContentPublicResDest = path.join(config.srcDir, 'content', 'public', 'android', 'java', 'res')
      const androidTouchtoFillResSource = path.join(config.misesCoreDir, 'browser', 'touch_to_fill', 'android', 'internal', 'java', 'res')
      const androidTouchtoFillResDest = path.join(config.srcDir, 'chrome', 'browser', 'touch_to_fill', 'android', 'internal', 'java', 'res')
      const androidToolbarResSource = path.join(config.misesCoreDir, 'browser', 'ui', 'android', 'toolbar', 'java', 'res')
      const androidToolbarResDest = path.join(config.srcDir, 'chrome', 'browser', 'ui', 'android', 'toolbar', 'java', 'res')
      const androidComponentsWidgetResSource = path.join(config.misesCoreDir, 'components', 'browser_ui', 'widget', 'android', 'java', 'res')
      const androidComponentsWidgetResDest = path.join(config.srcDir, 'components', 'browser_ui', 'widget', 'android', 'java', 'res')
      const androidComponentsStylesResSource = path.join(config.misesCoreDir, 'components', 'browser_ui', 'styles', 'android', 'java', 'res')
      const androidComponentsStylesResDest = path.join(config.srcDir, 'components', 'browser_ui', 'styles', 'android', 'java', 'res')
      const androidSafeBrowsingResSource = path.join(config.misesCoreDir, 'browser', 'safe_browsing', 'android', 'java', 'res')
      const androidSafeBrowsingResDest = path.join(config.srcDir, 'chrome', 'browser', 'safe_browsing', 'android', 'java', 'res')

      // Mapping for copying Mises's Android resource into chromium folder.
      const copyAndroidResourceMapping = {
        [androidTranslateResSource]: [androidTranslateResDest],
        [androidIconSource]: [androidIconDest],
        [androidIconBaseSource]: [androidIconBaseDest],
        [androidResSource]: [androidResDest],
        [androidResTemplateSource]: [androidResTemplateDest],
        [androidContentPublicResSource]: [androidContentPublicResDest],
        [androidTouchtoFillResSource]: [androidTouchtoFillResDest],
        [androidToolbarResSource]: [androidToolbarResDest],
        [androidComponentsWidgetResSource]: [androidComponentsWidgetResDest],
        [androidComponentsStylesResSource]: [androidComponentsStylesResDest],
        [androidSafeBrowsingResSource]: [androidSafeBrowsingResDest]
      }

      console.log('copy Android app icons and app resources')
      Object.entries(copyAndroidResourceMapping).map(([sourcePath, destPaths]) => {
        let androidSourceFiles = []
        if (!fs.existsSync(sourcePath)) {
          console.warn(`Warning: android source res not exists:` + sourcePath)
          return
        }
        if (fs.statSync(sourcePath).isDirectory()) {
          androidSourceFiles = util.walkSync(sourcePath)
        } else {
          androidSourceFiles = [sourcePath]
        }

        for (const destPath of destPaths) {
          for (const androidSourceFile of androidSourceFiles) {
            let destinationFile = path.join(destPath, path.relative(sourcePath, androidSourceFile))
            if (!fs.existsSync(destinationFile) || util.calculateFileChecksum(androidSourceFile) != util.calculateFileChecksum(destinationFile)) {
              fs.copySync(androidSourceFile, destinationFile)
            }
            misesOverwrittenFiles.add(destinationFile);
          }
        }
      })
      removeUnlistedAndroidResources(misesOverwrittenFiles)
    }
  },

  touchOverriddenFiles: () => {
    console.log('touch original files overridden by chromium_src...')

    // Return true when original file of |file| should be touched.
    const applyFileFilter = (file) => {
      // Only include overridable files.
      const supported_exts = ['.cc','.h', '.mm', '.mojom', '.py', '.pdl'];
      return supported_exts.includes(path.extname(file))
    }

    const chromiumSrcDir = path.join(config.srcDir, 'mises', 'chromium_src')
    var sourceFiles = util.walkSync(chromiumSrcDir, applyFileFilter)
    const additionalGen = getAdditionalGenLocation()

    // Touch original files by updating mtime.
    const chromiumSrcDirLen = chromiumSrcDir.length
    sourceFiles.forEach(chromiumSrcFile => {
      const relativeChromiumSrcFile = chromiumSrcFile.slice(chromiumSrcDirLen)
      let overriddenFile = path.join(config.srcDir, relativeChromiumSrcFile)
      if (fs.existsSync(overriddenFile)) {
        // If overriddenFile is older than file in chromium_src, touch it to trigger rebuild.
        updateFileUTimesIfOverrideIsNewer(overriddenFile, chromiumSrcFile)
      } else {
        // If the original file doesn't exist, assume that it's in the gen dir.
        overriddenFile = path.join(config.outputDir, 'gen', relativeChromiumSrcFile)
        deleteFileIfOverrideIsNewer(overriddenFile, chromiumSrcFile)
        // Also check the secondary gen dir, if exists
        if (!!additionalGen) {
          overriddenFile = path.join(config.outputDir, additionalGen, 'gen', relativeChromiumSrcFile)
          deleteFileIfOverrideIsNewer(overriddenFile, chromiumSrcFile)
        }
      }
    })
  },

  touchOverriddenVectorIconFiles: () => {
    console.log('touch original vector icon files overridden by mises/vector_icons...')

    // Return true when original file of |file| should be touched.
    const applyFileFilter = (file) => {
      // Only includes icon files.
      const ext = path.extname(file)
      if (ext !== '.icon') { return false }
      return true
    }

    const misesVectorIconsDir = path.join(config.srcDir, 'mises', 'vector_icons')
    var misesVectorIconFiles = util.walkSync(misesVectorIconsDir, applyFileFilter)

    // Touch original files by updating mtime.
    const misesVectorIconsDirLen = misesVectorIconsDir.length
    misesVectorIconFiles.forEach(misesVectorIconFile => {
      var overriddenFile = path.join(config.srcDir, misesVectorIconFile.slice(misesVectorIconsDirLen))
      if (fs.existsSync(overriddenFile)) {
        // If overriddenFile is older than file in vector_icons, touch it to trigger rebuild.
        updateFileUTimesIfOverrideIsNewer(overriddenFile, misesVectorIconFile)
      }
    })
  },

  touchOverriddenFilesAndUpdateBranding: () => {
    util.touchOverriddenFiles()
    util.touchOverriddenVectorIconFiles()
    util.updateBranding()
  },

  // Chromium compares pre-installed midl files and generated midl files from IDL during the build to check integrity.
  // Generated files during the build time and upstream pre-installed files are different because we use different IDL file.
  // So, we should copy our pre-installed files to overwrite upstream pre-installed files.
  // After checking, pre-installed files are copied to gen dir and they are used to compile.
  // So, this copying in every build doesn't affect compile performance.
  updateOmahaMidlFiles: () => {
    console.log('update omaha midl files...')
    const srcDir = path.join(config.misesCoreDir, 'win_build_output', 'midl', 'google_update')
    const dstDir = path.join(config.srcDir, 'third_party', 'win_build_output', 'midl', 'google_update')
    fs.copySync(srcDir, dstDir)
  },

  // TODO(bridiver) - this should move to gn and windows should call signApp like other platforms
  signWinBinaries: () => {
    // Copy & sign only binaries for widevine sig file generation.
    // With this, create_dist doesn't trigger rebuild because original binaries is not modified.
    const dir = path.join(config.outputDir, 'signed_binaries')
    if (!fs.existsSync(dir))
      fs.mkdirSync(dir);

    fs.copySync(path.join(config.outputDir, 'mises.exe'), path.join(dir, 'mises.exe'));
    fs.copySync(path.join(config.outputDir, 'chrome.dll'), path.join(dir, 'chrome.dll'));

    util.run('python', [path.join(config.misesCoreDir, 'script', 'sign_binaries.py'), '--build_dir=' + dir])
  },

  // TODO(bridiver) - this should move to gn
  generateWidevineSigFiles: () => {
    if (process.platform !== 'win32')
      return

    const cert = config.sign_widevine_cert
    const key = config.sign_widevine_key
    const passwd = config.sign_widevine_passwd
    const sig_generator = config.signature_generator
    let src_dir = path.join(config.outputDir, 'signed_binaries')

    if (!config.shouldSign())
      src_dir = config.outputDir

    console.log('generate Widevine sig files...')

    util.run('python', [sig_generator, '--input_file=' + path.join(src_dir, 'mises.exe'),
        '--flags=1',
        '--certificate=' + cert,
        '--private_key=' + key,
        '--output_file=' + path.join(config.outputDir, 'mises.exe.sig'),
        '--private_key_passphrase=' + passwd])
    util.run('python', [sig_generator, '--input_file=' + path.join(src_dir, 'chrome.dll'),
        '--flags=0',
        '--certificate=' + cert,
        '--private_key=' + key,
        '--output_file=' + path.join(config.outputDir, 'chrome.dll.sig'),
        '--private_key_passphrase=' + passwd])
  },

  buildNativeRedirectCC: (options = config.defaultOptions) => {
    // Expected path to redirect_cc.
    const redirectCC = path.join(config.nativeRedirectCCDir, util.appendExeIfWin32('redirect_cc'))

    // Only build if the source has changed unless it's CI
    if (!config.isCI &&
        fs.existsSync(redirectCC) &&
        fs.statSync(redirectCC).mtime >=
        fs.statSync(path.join(config.misesCoreDir, 'tools', 'redirect_cc', 'redirect_cc.cc')).mtime) {
      return
    }

    console.log('building native redirect_cc...')

    gnArgs = {
      'import("//mises/tools/redirect_cc/args.gni")': null,
      use_goma: config.use_goma,
      goma_dir: config.realGomaDir,
      real_gomacc: path.join(config.realGomaDir, 'gomacc'),
    }
    // Temprorary workaround for VS2022 lld-link PDB issue. Should be resolved
    // in May 2022 update.
    if (process.platform === 'win32') {
      gnArgs = {...gnArgs, is_component_build: true}
    }

    const buildArgsStr = util.buildArgsToString(gnArgs)
    util.run('gn', ['gen', config.nativeRedirectCCDir, '--args="' + buildArgsStr + '"'], options)

    util.buildTarget('mises/tools/redirect_cc', mergeWithDefault({outputDir: config.nativeRedirectCCDir}))
  },

  runGnGen: (options) => {
    const buildArgsStr = util.buildArgsToString(config.buildArgs())
    const buildArgsFile = path.join(config.outputDir, 'mises_build_args.txt')
    const buildNinjaFile = path.join(config.outputDir, 'build.ninja')
    const gnArgsFile = path.join(config.outputDir, 'args.gn')
    const prevBuildArgs = fs.existsSync(buildArgsFile) ?
      fs.readFileSync(buildArgsFile) : undefined
    const extraGnGenOptsFile = path.join(config.outputDir, 'mises_extra_gn_gen_opts.txt')
    const prevExtraGnGenOpts = fs.existsSync(extraGnGenOptsFile) ?
      fs.readFileSync(extraGnGenOptsFile) : undefined

    const shouldRunGnGen = config.force_gn_gen ||
      !fs.existsSync(buildNinjaFile) || !fs.existsSync(gnArgsFile) ||
      !prevBuildArgs || prevBuildArgs != buildArgsStr ||
      !prevExtraGnGenOpts || prevExtraGnGenOpts != config.extraGnGenOpts

    if (shouldRunGnGen) {
      // `gn gen` can modify args.gn even if it's failed.
      // Therefore delete the file to make sure that args.gn and
      // mises_build_args.txt are in sync.
      if (prevBuildArgs)
        fs.removeSync(buildArgsFile)

      util.run('gn', ['gen', config.outputDir, '--args="' + buildArgsStr + '"', config.extraGnGenOpts], options)
      fs.writeFileSync(buildArgsFile, buildArgsStr)
      fs.writeFileSync(extraGnGenOptsFile, config.extraGnGenOpts)
    }
  },

  generateNinjaFiles: (options = config.defaultOptions) => {
    util.buildNativeRedirectCC()

    console.log('generating ninja files...')

    if (process.platform === 'win32') {
      util.updateOmahaMidlFiles()
    }
    util.runGnGen(options)
  },

  buildTarget: (target = config.buildTarget, options = config.defaultOptions) => {
    const buildId = crypto.randomUUID()
    console.log('building ' + target + ' (id=' + buildId + ') ...')

    let num_compile_failure = 1
    if (config.ignore_compile_failure)
      num_compile_failure = 0

    let ninjaOpts = [
      '-C', options.outputDir || config.outputDir, target,
      '-k', num_compile_failure,
      ...config.extraNinjaOpts
    ]

    const use_goma_online = config.use_goma && !config.goma_offline
    if (use_goma_online) {
      assert(config.gomaServerHost !== undefined && config.gomaServerHost != null, 'goma server host must be set')
      options.env.GOMA_SERVER_HOST = config.gomaServerHost

      // Upload stats about Goma actions to the Goma backend.
      options.env.GOMA_PROVIDE_INFO = true

      // Disable HTTP2 proxy. According to EngFlow this has significant performance impact.
      options.env.GOMACTL_USE_PROXY = 0

      // This skips the auth check and make this call instant if compiler_proxy is already running.
      // If compiler_proxy is not running, it will fail to start if no valid credentials are found.
      options.env.GOMACTL_SKIP_AUTH = 1
      const gomaStartInfo = util.runProcess('goma_ctl', ['ensure_start'], options)
      delete options.env.GOMACTL_SKIP_AUTH

      if (gomaStartInfo.status !== 0) {
        const gomaLoginInfo = util.runProcess('goma_auth', ['info'], options)
        if (gomaLoginInfo.status !== 0) {
          console.log('Login required for using Goma. This is only needed once')
          util.run('goma_auth', ['login'], options)
        }
        util.run('goma_ctl', ['ensure_start'], options)
      }
    }

    if (config.isCI && use_goma_online) {
      util.run('goma_ctl', ['showflags'], options)
      util.run('goma_ctl', ['stat'], options)
    }

    // Setting `AUTONINJA_BUILD_ID` allows tracing Goma remote execution which helps with
    // debugging issues (e.g., slowness or remote-failures).
    options.env.AUTONINJA_BUILD_ID = buildId
    util.run('autoninja', ninjaOpts, options)

    if (config.isCI && use_goma_online) {
      util.run('goma_ctl', ['stat'], options)
    }
  },

  generateXcodeWorkspace: (options = config.defaultOptions) => {
    console.log('generating Xcode workspace for "' + config.xcode_gen_target + '"...')

    const args = util.buildArgsToString(config.buildArgs())
    const genScript = path.join(config.misesCoreDir, 'vendor', 'gn-project-generators', 'xcode.py')

    var genArgs = [
      'gen', config.outputDir + "_Xcode",
      '--args="' + args + '"',
      '--ide=json',
      '--json-ide-script="' + genScript + '"',
      '--filters="' + config.xcode_gen_target + '"'
    ]
    if (config.xcode_gen_target == 'mac') {
      genArgs = [
        'gen', config.outputDir,
        '--args="' + args + '"',
        '--ide=xcode'
      ]
    }

    if (config.xcode_gen_target == '//mises/ios:*') {
      let buildConfigDir = config.buildConfig
      if (config.targetArch && config.targetArch != 'x64') {
        buildConfigDir = buildConfigDir + '_' + config.targetArch
      }
      if (config.targetOS && (config.targetOS === 'android' || this.targetOS === 'ios')) {
        buildConfigDir = config.targetOS + "_" + buildConfigDir
      }
      if (config.targetEnvironment) {
        buildConfigDir = buildConfigDir + "_" + config.targetEnvironment
      }

      genArgs = [
        'gen', config.outputDir,
        '--args="' + args + '"',
        '--ide=xcode', '--xcode-build-system=new',
        '--xcode-configs=' + config.buildConfig,
        //'--xcode-additional-files-roots=//ios;//ios_internal;//docs;//components',
        '--xcode-config-build-dir=//out/ios_' + buildConfigDir
      ]
    }

    util.run('gn', genArgs, options)
  },

  lint: (options = {}) => {
    if (!options.base) {
      options.base = 'origin/master'
    }
    let cmd_options = config.defaultOptions
    cmd_options.cwd = config.misesCoreDir
    cmd_options = mergeWithDefault(cmd_options)
    util.run(
        'vpython3',
        [
          '-vpython-spec=' + path.join(config.depotToolsDir, '.vpython3'),
          path.join(
              config.misesCoreDir, 'build', 'commands', 'scripts', 'lint.py'),
          '--project_root=' + config.srcDir, '--base_branch=' + options.base
        ],
        cmd_options)
  },

  presubmit: (options = {}) => {
    if (!options.base) {
      options.base = 'origin/master'
    }
    // Temporary cleanup call, should be removed when everyone will remove
    // 'gerrit.host' from their mises checkout.
    util.runGit(
        config.misesCoreDir, ['config', '--unset-all', 'gerrit.host'], true)
    let cmd_options = config.defaultOptions
    cmd_options.cwd = config.misesCoreDir
    cmd_options = mergeWithDefault(cmd_options)
    cmd = 'git'
    // --upload mode is similar to `git cl upload`. Non-upload mode covers less
    // checks.
    args = ['cl', 'presubmit', options.base, '--force', '--upload']
    if (options.all)
      args.push('--all')
    if (options.files)
      args.push('--files', options.files)
    if (options.verbose) {
      args.push(...Array(options.verbose).fill('--verbose'))
    }
    util.run(cmd, args, cmd_options)
  },

  format: (options = {}) => {
    if (!options.base) {
      options.base = 'origin/master'
    }
    let cmd_options = config.defaultOptions
    cmd_options.cwd = config.misesCoreDir
    cmd_options = mergeWithDefault(cmd_options)
    cmd = 'git'
    args = ['cl', 'format', '--upstream=' + options.base]
    if (options.full)
      args.push('--full')
    if (options.js)
      args.push('--js')
    if (options.python)
      args.push('--python')
     if (options.rust)
      args.push('--rust-fmt')
    if (options.swift)
      args.push('--swift-format')
    util.run(cmd, args, cmd_options)
  },

  massRename: (options = {}) => {
    let cmd_options = config.defaultOptions
    cmd_options.cwd = config.misesCoreDir
    util.run('python3', [path.join(config.srcDir, 'tools', 'git', 'mass-rename.py')], cmd_options)
  },

  runGClient: (args, options = {}, gClientFile = config.gClientFile) => {
    if (config.gClientVerbose) {
      args.push('--verbose')
    }
    options.cwd = options.cwd || config.rootDir
    options = mergeWithDefault(options)
    options.env.GCLIENT_FILE = gClientFile
    util.run('gclient', args, options)
  },

  applyPatches: () => {
    return applyPatches()
  },

  buildArgsToString: (buildArgs) => {
    let args = ''
    for (let arg in buildArgs) {
      let val = buildArgs[arg]
      if (val !== null) {
        if (typeof val === 'string') {
          val = '"' + val + '"'
        } else {
          val = JSON.stringify(val)
        }
      }
      args += val ? arg + '=' + val + ' ' : arg + ' '
    }
    return args.replace(/"/g,'\\"')
  },

  walkSync: (dir, filter = null, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {
      if (fs.statSync(path.join(dir, file)).isDirectory()) {
        filelist = util.walkSync(path.join(dir, file), filter, filelist)
      } else if (!filter || filter.call(null, file)) {
        filelist = filelist.concat(path.join(dir, file))
      }
    })
    return filelist
  },

  appendExeIfWin32: (input) => {
    if (process.platform === 'win32')
      input += '.exe'
    return input
  },

  readJSON: (file, default_value = undefined) => {
    if (!fs.existsSync(file)) {
      return default_value
    }
    return fs.readJSONSync(file)
  },

  writeJSON: (file, value) => {
    return fs.writeJSONSync(file, value, {spaces: 2})
  },

  getGitDir: (repoDir) => {
    const dotGitPath = path.join(repoDir, '.git')
    if (!fs.existsSync(dotGitPath)) {
      return null
    }
    if (fs.statSync(dotGitPath).isDirectory()) {
      return dotGitPath
    }
    // Returns the actual .git dir in case a worktree is used.
    gitDir = util.runGit(repoDir, ['rev-parse', '--git-common-dir'], false)
    if (!path.isAbsolute(gitDir)) {
      return path.join(repoDir, gitDir)
    }
    return gitDir
  },

  getGitInfoExcludeFileName: (repoDir, create) => {
    const gitDir = util.getGitDir(repoDir)
    if (!gitDir) {
      assert(!create, `Can't create git exclude, .git not found in: ${repoDir}`)
      return null
    }
    const gitInfoDir = path.join(gitDir, 'info')
    const excludeFileName = path.join(gitInfoDir, 'exclude')
    if (!fs.existsSync(excludeFileName)) {
      if (!create) {
        return null
      }
      if (!fs.existsSync(gitInfoDir)) {
        fs.mkdirSync(gitInfoDir)
      }
      fs.writeFileSync(excludeFileName, '')
    }
    return excludeFileName
  },

  isGitExclusionExists: (repoDir, exclusion) => {
    const excludeFileName = util.getGitInfoExcludeFileName(repoDir, false)
    if (!excludeFileName) {
      return false
    }
    const lines = fs.readFileSync(excludeFileName).toString().split(/\r?\n/)
    for (const line of lines) {
      if (line === exclusion) {
        return true
      }
    }
    return false
  },

  addGitExclusion: (repoDir, exclusion) => {
    if (util.isGitExclusionExists(repoDir, exclusion)) {
      return
    }
    const excludeFileName = util.getGitInfoExcludeFileName(repoDir, true)
    fs.appendFileSync(excludeFileName, '\n' + exclusion)
  },
}

module.exports = util
