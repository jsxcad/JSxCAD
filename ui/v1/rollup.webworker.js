import '@babel/plugin-proposal-class-properties';
import '@babel/plugin-transform-react-jsx';
import '@babel/preset-env';
import '@babel/preset-react';

import babel from 'rollup-plugin-babel';
import builtins from 'rollup-plugin-node-builtins';
import commonjs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import hypothetical from 'rollup-plugin-hypothetical-windows-fix';
import json from 'rollup-plugin-json';
import loadz0r from 'rollup-plugin-loadz0r';
import nodeResolve from 'rollup-plugin-node-resolve';
import sizes from 'rollup-plugin-sizes';

Error.stackTraceLimit = Infinity;

export default {
  input: 'webworker.js',
  output: {
    dir: 'dist',
    format: 'amd'
  },
  external: [],
  plugins: [
    hypothetical(
      {
        allowFallthrough: true,
        allowRealFiles: true,
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
    babel({
      babelrc: false,
      exclude: [/node_modules/, /polybooljs/],
      presets: ['@babel/preset-react',
                ['@babel/env', { 'targets': { 'browsers': 'last 1 chrome versions' } }]],
      plugins: [
        '@babel/transform-react-jsx',
        '@babel/plugin-proposal-class-properties'
      ]
    }),
    commonjs({
      namedExports: {
        '../../node_modules/binpackingjs/dist/BinPacking.min.js': [
          'BP2D'
        ]
      }
    }),
    globals(),
    json(),
    nodeResolve({ jsnext: true, preferBuiltins: true }),
    sizes()
  ]
};
