module.exports = (api) => {
  api.cache(true)

  const presets = [[require('@babel/preset-env')]]
  const plugins = [
    [
      require('@babel/plugin-transform-react-jsx'),
      {
        pragma: 'createElement',
      },
    ],
  ]

  return {
    presets,
    plugins,
  }
}
