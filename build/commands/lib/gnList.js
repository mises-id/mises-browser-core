const config = require('./config')
const util = require('./util')

const gnList = (buildConfig = config.defaultBuildConfig, options) => {
  config.buildConfig = buildConfig
  config.update(options)
  util.run('gn', ['ls', config.outputDir, '--testonly=false'], config.defaultOptions)
}

module.exports = gnList
