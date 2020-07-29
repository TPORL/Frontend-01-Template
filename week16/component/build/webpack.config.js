const path = require('path')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, '../src')],
        loader: 'babel-loader',
      },
      {
        test: /\.view$/,
        include: [path.resolve(__dirname, '../src')],
        loader: path.resolve(__dirname, '../loaders/view-loader/index.js'),
      },
    ],
  },
  optimization: {
    minimize: false,
  },
}
