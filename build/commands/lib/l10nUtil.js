/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */


/**
 * This file manages the following:
 * - Lists of files needed to be translated (Which is all top level GRD and JSON files)
 * - All mappings for auto-generated Mises files from the associated Chromium files.
 * - Top level global string replacements, such as replacing Chromium with Mises
 */

const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const { JSDOM } = require("jsdom")
const config = require('./config')

// Change to `true` for verbose console log output of GRD traversal
const verboseLogFindGrd = false
const srcDir = config.srcDir

// chromium_strings.grd and any of its parts files that we track localization for in transifex
// These map to mises/app/resources/chromium_strings*.xtb
const chromiumStringsPath = path.resolve(path.join(srcDir, 'chrome', 'app', 'chromium_strings.grd'))
const misesStringsPath = path.resolve(path.join(srcDir, 'mises', 'app', 'mises_strings.grd'))
const chromiumSettingsPartPath = path.resolve(path.join(srcDir, 'chrome', 'app', 'settings_chromium_strings.grdp'))
const misesSettingsPartPath = path.resolve(path.join(srcDir, 'mises', 'app', 'settings_mises_strings.grdp'))

//Replace android strings.
const androidChromeStringsPath = path.resolve(path.join(srcDir, 'chrome', 'browser', 'ui', 'android', 'strings', 'android_chrome_strings.grd'))
const misesAndroidChromeStringsPath = path.resolve(path.join(srcDir, 'mises', 'browser', 'ui', 'android', 'strings', 'android_chrome_strings.grd'))

// component_chromium_strings.grd and any of its parts files that we track localization for in transifex
// These map to mises/app/strings/components_chromium_strings*.xtb
const chromiumComponentsChromiumStringsPath = path.resolve(path.join(srcDir, 'components', 'components_chromium_strings.grd'))
const misesComponentsMisesStringsPath = path.resolve(path.join(srcDir, 'mises', 'components', 'components_mises_strings.grd'))

// components/component_strings.grd and any of its parts files that we track localization for in transifex
// These map to mises/components/component_strings*.xtb
const chromiumComponentsStringsPath = path.resolve(path.join(srcDir, 'components', 'components_strings.grd'))
const misesComponentsStringsPath = path.resolve(path.join(srcDir, 'mises', 'components', 'components_strings.grd'))

// generated_resources.grd and any of its parts files that we track localization for in transifex
// There is also chromeos_strings.grdp, but we don't need to track it here because it is explicitly skipped in transifex.py
// These map to mises/app/resources/generated_resoruces*.xtb
const chromiumGeneratedResourcesPath = path.resolve(path.join(srcDir, 'chrome', 'app', 'generated_resources.grd'))
const misesGeneratedResourcesPath = path.resolve(path.join(srcDir, 'mises', 'app', 'generated_resources.grd'))
const chromiumGeneratedResourcesExcludes = new Set(["chromeos_strings.grdp"])

// The following are not generated files but still need to be tracked so they get sent to transifex
// These xtb files don't need to be copied anywhere.
// mises_generated_resources.grd maps to mises/app/resources/mises_generated_resources*.xtb,
// mises_components_strings.grd maps to mises/components/resources/strings/mises_components_resources*.xtb
// messages.json localization is handled inside of mises-extension.
const misesSpecificGeneratedResourcesPath = path.resolve(path.join(srcDir, 'mises', 'app', 'mises_generated_resources.grd'))
const misesResourcesComponentsStringsPath = path.resolve(path.join(srcDir, 'mises', 'components', 'resources', 'mises_components_strings.grd'))
const misesExtensionMessagesPath = path.resolve(path.join(srcDir, 'mises', 'components', 'mises_extension', 'extension', 'mises_extension', '_locales', 'en_US', 'messages.json'))
const misesAndroidMisesStringsPath = path.resolve(path.join(srcDir, 'mises', 'browser', 'ui', 'android', 'strings', 'android_mises_strings.grd'))

// Helper function to find all grdp parts in a grd.
function getGrdPartsFromGrd(path) {
  const grd = new JSDOM(fs.readFileSync(path, 'utf8'))
  const partTags = grd.window.document.getElementsByTagName("part")
  let parts = new Array()
  for (const partTag of partTags) {
    parts.push(partTag.getAttribute('file'));
  }
  return parts
}

// Helper function to create a mapping for grd and all of its grdp parts.
function addGrd(chromiumPath, misesPath, exclude = new Set()) {
  if (verboseLogFindGrd)
    console.log("Adding mappings for GRD: " + chromiumPath)
  if (!fs.existsSync(chromiumPath)) {
    const err = new Error(`addGrd: Error. File not found at path "${chromiumPath}"`)
    console.error(err)
    throw err
  }
  let mapping = {}
  // Add grd parts before grd because chromium-rebase-l10n.py expects them to be
  // processed first.
  const grdps = getGrdPartsFromGrd(chromiumPath)
  if (grdps.length) {
    const chromiumDir = path.dirname(chromiumPath)
    const misesDir = path.dirname(misesPath)
    for (const grdp of grdps) {
      if (exclude.has(grdp)) {
        continue
      }
      const chromiumGrdpPath = path.resolve(path.join(chromiumDir, grdp))
      const misesGrdpPath = path.resolve(path.join(misesDir, grdp))
      // grdp files can have their own grdp parts too
      mapping = { ...mapping, ...addGrd(chromiumGrdpPath, misesGrdpPath, exclude) }
    }
    if (verboseLogFindGrd)
      console.log("  - Added " + (Object.keys(mapping).length - 1) + " GRDP.")
  }
  mapping[chromiumPath] = misesPath
  return mapping
}

// Helper functions that's, for a given pair of chromium to mises GRD mapping
// from the supplied map, determines which GRDP parts are no longer present in
// the chromium GRD file.
function getRemovedGRDParts(mapping) {
  let removedMap = new Map()
  for (const [sourcePath, destPath] of Object.entries(mapping)) {
    if (path.extname(destPath) === ".grd") {
      const misesGRDPs = getGrdPartsFromGrd(destPath)
      const chromiumGRDPs = getGrdPartsFromGrd(sourcePath)
      let removed = new Set()
      for (let i = 0; i < misesGRDPs.length; i++) {
        if (!chromiumGRDPs.includes(misesGRDPs[i])) {
          removed.add(misesGRDPs[i])
        }
      }
      if (removed.size) {
        removedMap.set(destPath, removed)
      }
    }
  }
  return removedMap
}

// Add all GRD mappings here.
function getAutoGeneratedGrdMappings() {
  if (typeof(getAutoGeneratedGrdMappings.mappings) === 'undefined') {
    console.log(chalk.italic('Recursing through GRD to find GRDP files...'))
    // Mises specific only grd and grdp files should NOT be added.
    // Using AddGrd will add GRD and all of its GRDPs.
    getAutoGeneratedGrdMappings.mappings = {
      ...addGrd(chromiumComponentsStringsPath, misesComponentsStringsPath),
      ...addGrd(chromiumGeneratedResourcesPath, misesGeneratedResourcesPath, chromiumGeneratedResourcesExcludes),
      ...addGrd(androidChromeStringsPath, misesAndroidChromeStringsPath)
    }
    console.log(chalk.italic('Done recursing through GRD to find GRDP files.'))
  }
  return getAutoGeneratedGrdMappings.mappings
}

function getChromiumToAutoGeneratedMisesMapping() {
  if (typeof(getChromiumToAutoGeneratedMisesMapping.mapping) === 'undefined') {
    // When adding new grd or grdp files, never add a grdp part path without a
    // parent grd path, but add the grd parts to the mapping before the parent
    // grd, becase chromium-rebase-l10n.py expects them to be processed first.
    // Group them with a leading and trailing newline to keep this file organized.
    // The first 3 are added explicitly because we change the file names.
    getChromiumToAutoGeneratedMisesMapping.mapping = {
      [chromiumSettingsPartPath]: misesSettingsPartPath,
      [chromiumStringsPath]: misesStringsPath,

      [chromiumComponentsChromiumStringsPath]: misesComponentsMisesStringsPath,

      ...getAutoGeneratedGrdMappings()
    }
  }
  return getChromiumToAutoGeneratedMisesMapping.mapping
}

const l10nUtil = {
  // Same as with chromiumToAutoGeneratedMisesMapping but maps in the opposite direction
  getAutoGeneratedMisesToChromiumMapping: () => {
    if (typeof(l10nUtil.getAutoGeneratedMisesToChromiumMapping.mapping) === 'undefined') {
      const chromiumToAutoGeneratedMisesMapping = getChromiumToAutoGeneratedMisesMapping()
      l10nUtil.getAutoGeneratedMisesToChromiumMapping.mapping = Object.keys(
        chromiumToAutoGeneratedMisesMapping).reduce((obj, key) => (
          { ...obj, [chromiumToAutoGeneratedMisesMapping[key]]: key }), {})
    }
    return l10nUtil.getAutoGeneratedMisesToChromiumMapping.mapping
  },

  // All paths which are generated
  getMisesAutoGeneratedPaths: () => {
    return Object.values(getChromiumToAutoGeneratedMisesMapping())
  },

  // All paths which are not generated
  getMisesNonGeneratedPaths: () => {
    if (typeof(l10nUtil.getMisesNonGeneratedPaths.paths) === 'undefined') {
      l10nUtil.getMisesNonGeneratedPaths.paths = [
        misesSpecificGeneratedResourcesPath,
        misesResourcesComponentsStringsPath,
        misesExtensionMessagesPath,
        misesAndroidMisesStringsPath
      ]
    }
    return l10nUtil.getMisesNonGeneratedPaths.paths
  },

  // Mises specific strings and Chromium mapped Mises strings will be here.
  // But you only need to add the Mises specific strings manually here.
  getAllMisesPaths: () => {
    return l10nUtil.getMisesNonGeneratedPaths().concat(l10nUtil.getMisesAutoGeneratedPaths())
  },

  // Get all GRD and JSON paths whether they are generatd or not
  // Push and pull scripts for l10n use this.
  // Transifex manages files per grd and not per grd or grdp.
  // This is because only 1 xtb is created per grd per locale even if it has multiple grdp files.
  getMisesTopLevelPaths: () => {
    return l10nUtil.getAllMisesPaths().filter((x) => ['grd', 'json'].includes(x.split('.').pop()))
  },

// Helper function to retrieve Greaselion script paths relative to the
// Mises paths.
//
// Greaselion.json consists of an array of Greaselion rules,
// specifying scripts to inject into given sites based on certain
// preconditions. If the rule contains a "messages" key, then the
// script contains user-visible strings that require translation. This
// helper function gathers those messages.json files for transmission
// to Transifex.
  getGreaselionScriptPaths: (extensionPath) => {
    let basePath = extensionPath
    if (!basePath) {
      basePath = '../../../mises-site-specific-scripts'
    }

    const jsonContent = fs.readFileSync(`${basePath}/Greaselion.json`, 'utf8')
    if (!jsonContent) {
      console.error('Missing Greaselion.json')
      return []
    }

    const greaselionRules = JSON.parse(jsonContent)
    if (!greaselionRules) {
      console.error('Malformed Greaselion.json')
      return []
    }

    let paths = []
    greaselionRules.forEach((rule) => {
      if (rule.messages) {
        paths.push(`${basePath}/${rule.messages}/en_US/messages.json`)
      }
    })

    return paths
  },

  // Helper function to pretty print removed GRDP file names.
  logRemovedGRDParts: (mapping) => {
    if (mapping.size) {
      console.log("\n**************************************************************************")
      console.log("The following GRDP files are no longer in the corresponding Chromium GRDs:\n")
      for (const [grd, grdps] of mapping.entries()) {
        console.log("  From " + grd + ":")
        for (const grdp of grdps) {
          console.log("    - " + grdp)
        }
      }
    }
  },

  // This simply reads Chromium files that are passed to it and replaces branding strings
  // with Mises specific branding strings.
  // Do not use this for filtering XML, instead use chromium-rebase-l10n.py.
  // Only add idempotent replacements here (i.e. don't append replace A with AX here)
  rebaseMisesStringFilesOnChromiumL10nFiles: async (path) => {
    const removedMap = getRemovedGRDParts(getAutoGeneratedGrdMappings())
    const ops = Object.entries(getChromiumToAutoGeneratedMisesMapping()).map(async ([sourcePath, destPath]) => {
      let contents = await new Promise(resolve => fs.readFile(sourcePath, 'utf8', (err, data) => resolve(data)))
      await new Promise(resolve => fs.writeFile(destPath, contents, 'utf8', resolve))
    })
    await Promise.all(ops)
    return removedMap
  },
}  // const l10nUtil

module.exports = l10nUtil
