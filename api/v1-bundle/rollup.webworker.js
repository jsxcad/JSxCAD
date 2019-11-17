// rollup.config.js
import builtins from 'rollup-plugin-node-builtins';
import commonjs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import hypothetical from 'rollup-plugin-hypothetical';
import json from 'rollup-plugin-json';
import loadz0r from 'rollup-plugin-loadz0r';
import nodeResolve from 'rollup-plugin-node-resolve';

Error.stackTraceLimit = Infinity;

export default {
  input: 'webworker.js',
  output: {
    dir: 'webworker.dist',
    format: 'amd'
  },
  external: [
  ],
  plugins: [
    hypothetical(
      {
        allowFallthrough: true,
        files: {
          'fast-png': 'export const encode = {}; export const decode = {};',
          'fs': 'export const promises = {};',
          'gl': 'const dummy = {}; export default dummy;',
          'node-fetch': 'export default {};',
          'os': '',
          'tty': ''
        }
      }),
    loadz0r(),
    builtins(),
    commonjs(),
    globals(),
    json(),
    nodeResolve({ jsnext: true, preferBuiltins: true })
  ]
};
