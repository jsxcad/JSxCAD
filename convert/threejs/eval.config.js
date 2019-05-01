const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './eval.js',
  output: {
    filename: 'eval.js',
    library: 'api',
    libraryTarget: 'var'
  },
  plugins: [
    new webpack.DefinePlugin({
      IS_BROWSER: true
    })
  ],
  node: {
    esm: 'empty',
    fs: 'empty'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        type: 'javascript/auto',
        exclude: /node_modules/
      }
    ]
  }
};
