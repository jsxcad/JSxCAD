// rollup.config.js
import builtins from 'rollup-plugin-node-builtins';
import commonjs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: 'main.js',
  output: {
    file: 'bundle.js',
    format: 'esm'
  },
  external: [
    '@jsxcad/convert-jscad',
    '@jsxcad/convert-threejs',
    '@jsxcad/sys',
  ],
  plugins: [
    nodeResolve({ preferBuiltins: false }),
    commonjs(),
    globals(),
    builtins()
  ],
};
