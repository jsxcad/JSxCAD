import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import nodeResolve from 'rollup-plugin-node-resolve';

Error.stackTraceLimit = Infinity;

export default {
  input: 'main.js',
  output: {
    dir: 'dist',
    format: 'module'
  },
  external: ['@jsxcad/math-utils'],
  plugins: [
    builtins(),
    globals(),
    nodeResolve({ preferBuiltins: true })
  ]
};
