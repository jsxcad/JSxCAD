// rollup.config.js
import builtins from 'rollup-plugin-node-builtins';
import commonjs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import hypothetical from 'rollup-plugin-hypothetical';
import json from 'rollup-plugin-json';
import loadz0r from 'rollup-plugin-loadz0r';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: 'display.js',
  output: {
    dir: 'dist',
    format: 'amd'
  },
  external: [],
  plugins: [
    loadz0r(),
    builtins(),
    commonjs(),
    globals(),
    json(),
    hypothetical(
      {
        allowFallthrough: true,
        files: {
          'fs': 'export const promises = {};',
          'node-fetch': 'export default {};',
          'os': '',
          'tty': ''
        }
      }),
    nodeResolve({ jsnext: true, preferBuiltins: true })
  ]
};
