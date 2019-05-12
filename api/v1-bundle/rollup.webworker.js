// rollup.config.js
import builtins from 'rollup-plugin-node-builtins';
import commonjs from 'rollup-plugin-commonjs';
import loadz0r from "rollup-plugin-loadz0r";
import globals from 'rollup-plugin-node-globals';
import hypothetical from 'rollup-plugin-hypothetical';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: 'webworker.js',
  output: {
    dir: 'webworker.dist',
    format: 'amd'
  },
  external: [
    'buffer',
    'events',
    'process'
  ],
  plugins: [
    loadz0r(),
    commonjs(),
    hypothetical(
      {
        allowFallthrough: true,
        files: {
          'fs': '',
          'node-fetch': '',
          'os': '',
          'tty': '',
        }
      }),
    nodeResolve({ preferBuiltins: false }),
    globals()
  ]
};
