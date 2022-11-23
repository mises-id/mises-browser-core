const fs = require('fs-extra')
const path = require('path')

const config = require('../lib/config')
const util = require('../lib/util')
const assert = require('assert')

const getTestBinary = (suite) => {
  return (process.platform === 'win32') ? `${suite}.exe` : suite
}

const getTestsToRun = (config, suite) => {
  let testsToRun = [suite]
  if (suite === 'mises_unit_tests') {
    if (config.targetOS !== 'android') {
      testsToRun.push('mises_installer_unittests')
    } else {
      testsToRun.push('bin/run_mises_public_test_apk')
    }
  }
  return testsToRun
}

// Returns a list of paths to files containing all the filters that would apply
// to the current test suite, as long as such files exist in the filesystem.
//
// For instance, for Windows 64-bit and assuming all the filters files exist
// in the filesystem, this method would return paths to the following files:
//   - unit-tests.filter              -> Base filters
//   - unit_tests-windows.filters:    -> Platform specific
//   - unit_tests-windows-x86.filters -> Platform & Architecture specific
const getApplicableFilters = (suite) => {
  let filterFilePaths = []

  let targetPlatform = process.platform
  if (targetPlatform === "win32") {
    targetPlatform = "windows"
  } else if (targetPlatform === "darwin") {
    targetPlatform = "macos"
  }

  let possibleFilters = [
    suite,
    [suite, targetPlatform].join('-'),
    [suite, targetPlatform, config.targetArch].join('-'),
  ]
  possibleFilters.forEach(filterName => {
    let filterFilePath = path.join(config.misesCoreDir, 'test', 'filters',  `${filterName}.filter`)
    if (fs.existsSync(filterFilePath))
      filterFilePaths.push(filterFilePath)
  });

  return filterFilePaths
}

const test = (passthroughArgs, suite, buildConfig = config.defaultBuildConfig, options) => {
  config.buildConfig = buildConfig
  config.update(options)

  let misesArgs = [
    '--enable-logging=stderr'
  ]

  // Android doesn't support --v
  if (config.targetOS !== 'android') {
    misesArgs.push('--v=' + options.v)

    if (options.vmodule) {
      misesArgs.push('--vmodule=' + options.vmodule)
    }
  }

  if (options.filter) {
    misesArgs.push('--gtest_filter=' + options.filter)
  }

  if (options.run_disabled_tests) {
    misesArgs.push('--gtest_also_run_disabled_tests')
  }

  if (options.output) {
    misesArgs.push('--gtest_output=xml:' + options.output)
  }

  if (options.disable_mises_extension) {
    misesArgs.push('--disable-mises-extension')
  }

  if (options.single_process) {
    misesArgs.push('--single_process')
  }

  if (options.test_launcher_jobs) {
    misesArgs.push('--test-launcher-jobs=' + options.test_launcher_jobs)
  }

  misesArgs = misesArgs.concat(passthroughArgs)

  // Build the tests
  let testSuites = [
    'mises_unit_tests',
    'mises_browser_tests',
    'mises_network_audit_tests',
  ]
  if (testSuites.includes(suite)) {
    config.buildTarget = 'mises/test:' + suite
  } else {
    config.buildTarget = suite
  }
  util.touchOverriddenFilesAndUpdateBranding()
  util.buildTarget()

  // Filter out upstream tests that are known to fail for Mises
  let upstreamTestSuites = [
    'unit_tests',
    'browser_tests',
  ]
  if (upstreamTestSuites.includes(suite)) {
    let filterFilePaths = getApplicableFilters(suite)
    if (filterFilePaths.length > 0)
      misesArgs.push(`--test-launcher-filter-file="${filterFilePaths.join(';')}"`)
  }

  if (config.targetOS === 'ios') {
    util.run(path.join(config.outputDir, "iossim"), [
      path.join(config.outputDir, `${suite}.app`),
      path.join(config.outputDir, `${suite}.app/PlugIns/${suite}_module.xctest`)
    ], config.defaultOptions)
  } else {
    // Run the tests
    getTestsToRun(config, suite).forEach((testSuite) => {
      if (options.output) {
        misesArgs.splice(misesArgs.indexOf('--gtest_output=xml:' + options.output), 1)
        misesArgs.push(`--gtest_output=xml:${testSuite}.xml`)
      }
      if (config.targetOS === 'android') {
        assert(
            config.targetArch === 'x86' || options.manual_android_test_device,
            'Only x86 build can be run automatically. For other builds please run test device manually and specify manual_android_test_device flag.')
      }
      if (config.targetOS === 'android' && !options.manual_android_test_device) {
        // Specify emulator to run tests on
        misesArgs.push(`--avd-config tools/android/avd/proto/generic_android28.textpb`)
      }
      util.run(path.join(config.outputDir, getTestBinary(testSuite)), misesArgs, config.defaultOptions)
    })
  }
}

module.exports = test
