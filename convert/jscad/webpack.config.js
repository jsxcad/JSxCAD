const path = require('path');

module.exports = {
  target: 'node',
  entry: './src/api/index.js',
  output: {
    // filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'api',
    libraryTarget: 'umd',
    filename: 'api.js',
  },
};
