// rollup.config.js
import builtins from 'rollup-plugin-node-builtins';
import commonjs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: 'service.test.webWorker.js',
  output: {
    file: 'service.test.webWorker.loadable.js',
    format: 'cjs'
  },
  external: [
  ],
  plugins: [
    nodeResolve({ preferBuiltins: false }),
    commonjs(),
    globals(),
    builtins()
  ]
};
