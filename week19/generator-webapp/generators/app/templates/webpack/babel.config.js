const path = require('path')

module.exports = (api) => {
  api.cache(true)

  const presets = [
    [
      require('@babel/preset-env'),
      {
        corejs: 3,
        modules: false,
        useBuiltIns: 'usage',
      },
    ],
  ]
  const plugins = [
    [
      require('@babel/plugin-transform-runtime'),
      {
        corejs: false,
        helpers: true,
        useESModules: true,
        absoluteRuntime: path.dirname(
          require.resolve('@babel/runtime/package.json')
        ),
      },
    ],
  ]

  return {
    presets,
    plugins,
  }
}
