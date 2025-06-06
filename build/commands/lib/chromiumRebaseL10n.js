/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */

const path = require('path')
const config = require('../lib/config')
const util = require('../lib/util')
const l10nUtil = require('./l10nUtil')
const Log = require('./sync/logging')

const resetChromeStringFiles = () => {
  // Revert to originals before string replacement because original grd(p)s are
  // overwritten with modified versions from ./src/mises during build.
  const srcDir = config.srcDir
  const targetFilesForReset = [ "*.grd", "*.grdp" ]
  targetFilesForReset.forEach((targetFile) => {
    util.run('git', ['checkout', '--', targetFile], { cwd: srcDir })
  })
}


async function applyGrdPatches() {
  const GitPatcher = require('../lib/gitPatcher')
  Log.progress('Applying patches...')
  // Always detect if we need to apply patches, since user may have modified
  // either chromium source files, or .patch files manually
  const coreRepoPath = config.misesCoreDir
  const patchesPath = path.join(coreRepoPath, 'patches', 'grd_patches')

  const chromiumRepoPath = config.srcDir

  const chromiumPatcher = new GitPatcher(patchesPath, chromiumRepoPath)

  const chromiumPatchStatus = await chromiumPatcher.applyPatches()

  const allPatchStatus =
    chromiumPatchStatus
  Log.allPatchStatus(allPatchStatus, 'Chromium')

  const hasPatchError = allPatchStatus.some(p => p.error)
  Log.progress('Done applying patches.')
  // Exit on error in any patch
  if (hasPatchError) {
    Log.error('Exiting as not all patches were successful!')
    process.exit(1)
  }
}

const chromiumRebaseL10n = async (options) => {
  resetChromeStringFiles()
  await applyGrdPatches()
  const removed = await l10nUtil.rebaseMisesStringFilesOnChromiumL10nFiles()
  l10nUtil.getMisesAutoGeneratedPaths().forEach((sourceStringPath) => {
    const cmdOptions = config.defaultOptions
    cmdOptions.cwd = config.misesCoreDir
    //util.run('python3', ['-m', 'pip','install', 'vendro/lxml/dist/lxml-5.3.0-cp311-cp311-manylinux_2_28_x86_64.whl'], cmdOptions)
    util.run('python3', ['script/chromium-rebase-l10n.py', '--source_string_path', sourceStringPath], cmdOptions)
  })
  l10nUtil.logRemovedGRDParts(removed)
}

module.exports = chromiumRebaseL10n
