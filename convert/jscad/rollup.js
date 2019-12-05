import builtins from 'rollup-plugin-node-builtins';
import commonjs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import nodeResolve from 'rollup-plugin-node-resolve';

Error.stackTraceLimit = Infinity;

export default {
  input: 'dist/api.js',
  output: {
    file: 'dist/main.js',
    format: 'module'
  },
  external (id) {
    return id.startsWith('@jsxcad/');
  },
  plugins: [
    builtins(),
    commonjs(),
    globals(),
    nodeResolve({ preferBuiltins: true })
  ]
};
