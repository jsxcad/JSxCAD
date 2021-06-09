import builtins from 'rollup-plugin-node-builtins';
import commonjs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import nodeResolve from 'rollup-plugin-node-resolve';

Error.stackTraceLimit = Infinity;

export default {
  input: 'main.js',
  output: {
    dir: 'dist',
    format: 'module',
    paths: (path) => {
      if (path.startsWith('es6')) {
        return `./${path.substr(4)}`;
      }
    },
  },
  external(id) {
    return id.includes('jsxcad-');
  },
  plugins: [
    builtins(),
    commonjs(),
    globals(),
    nodeResolve({ preferBuiltins: true }),
    {
      transform(code, id) {
        return code.replace(/'@jsxcad\/([^']*)'/g, "'es6/jsxcad-$1.js'");
      },
    },
  ],
};
