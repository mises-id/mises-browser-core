const path = require('path')
const fs = require('fs-extra')
const ip = require('ip')
const URL = require('url').URL
const config = require('../lib/config')
const util = require('../lib/util')

const start = (passthroughArgs, buildConfig = config.defaultBuildConfig, options) => {
  config.buildConfig = buildConfig
  config.update(options)

  let misesArgs = [
    '--enable-logging',
    '--v=' + options.v,
  ]
  if (options.vmodule) {
    misesArgs.push('--vmodule=' + options.vmodule);
  }
  if (options.no_sandbox) {
    misesArgs.push('--no-sandbox')
  }
  if (options.disable_mises_extension) {
    misesArgs.push('--disable-mises-extension')
  }
  if (options.disable_mises_rewards_extension) {
    misesArgs.push('--disable-mises-rewards-extension')
  }
  if (options.disable_pdfjs_extension) {
    misesArgs.push('--disable-pdfjs-extension')
  }
  if (options.disable_webtorrent_extension) {
    misesArgs.push('--disable-webtorrent-extension')
  }
  if (options.ui_mode) {
    misesArgs.push(`--ui-mode=${options.ui_mode}`)
  }
  if (!options.enable_mises_update) {
    // This only has meaning with MacOS and official build.
    misesArgs.push('--disable-mises-update')
  }
  if (options.disable_doh) {
    misesArgs.push('--disable-doh')
  }
  if (options.single_process) {
    misesArgs.push('--single-process')
  }
  if (options.show_component_extensions) {
    misesArgs.push('--show-component-extension-options')
  }
  if (options.rewards) {
    misesArgs.push(`--rewards=${options.rewards}`)
  }
  if (options.mises_ads_testing) {
    misesArgs.push('--mises-ads-testing')
  }
  if (options.mises_ads_debug) {
    misesArgs.push('--mises-ads-debug')
  }
  if (options.mises_ads_production) {
    misesArgs.push('--mises-ads-production')
  }
  if (options.mises_ads_staging) {
    misesArgs.push('--mises-ads-staging')
  }
  misesArgs = misesArgs.concat(passthroughArgs)

  let user_data_dir
  if (options.user_data_dir_name) {
    if (process.platform === 'darwin') {
      user_data_dir = path.join(process.env.HOME, 'Library', 'Application\\ Support', 'MisesSoftware', options.user_data_dir_name)
    } else if (process.platform === 'win32') {
      user_data_dir = path.join(process.env.LocalAppData, 'MisesSoftware', options.user_data_dir_name)
    } else {
      user_data_dir = path.join(process.env.HOME, '.config', 'MisesSoftware', options.user_data_dir_name)
    }
    misesArgs.push('--user-data-dir=' + user_data_dir);
  }

  let cmdOptions = {
    stdio: 'inherit',
    timeout: undefined,
    continueOnFail: false,
    shell: process.platform === 'darwin' ? true : false,
    killSignal: 'SIGTERM'
  }

  let outputPath = options.output_path
  if (!outputPath) {
    outputPath = path.join(config.outputDir, 'mises')
    if (process.platform === 'win32') {
      outputPath = outputPath + '.exe'
    } else if (process.platform === 'darwin') {
      outputPath = fs.readFileSync(outputPath + '_helper').toString().trim()
    }
  }
  util.run(outputPath, misesArgs, cmdOptions)
}

module.exports = start
