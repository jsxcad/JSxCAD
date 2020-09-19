const path = require('path');

module.exports = {
  target: 'node',
  entry: './occ-webpack.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    library: 'api',
    libraryTarget: 'umd',
    filename: 'occ.cjs'
  },
  module: {
    rules: [
      {
        test: /opencascade\.wasm\.wasm$/,
        type: "javascript/auto",
        loader: "file-loader",
        options: {
          publicPath: "dist/wasm/",
          outputPath: "wasm/"
        }
      }
    ]
  },
  node: {
    fs: "empty"
  }
};
