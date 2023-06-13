const config = require('../lib/config')
const util = require('../lib/util')

const gnCheck = (buildConfig = config.defaultBuildConfig, options) => {
  config.buildConfig = buildConfig
  config.update(options)
  util.run('gn', ['check', config.outputDir, '//services/device/public/mojom:mojom_js'], config.defaultOptions)
  util.run('python3', ['buildtools/checkdeps/checkdeps.py', 'mises', '--extra-repos=mises', '--no-resolve-dotdot'], config.defaultOptions)
}

module.exports = gnCheck
