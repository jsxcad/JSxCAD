// const EsmWebpackPlugin = require('@purtuga/esm-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './JSxCAD.js',
  output: {
    filename: 'JSxCAD.js',
    library: 'JSxCAD',
    libraryTarget: 'var'
  },
  plugins: [
    new webpack.DefinePlugin({
      IS_BROWSER: true
    })
    // new EsmWebpackPlugin(),
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
