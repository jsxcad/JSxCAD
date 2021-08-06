// rollup.config.js
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import hypothetical from 'rollup-plugin-hypothetical-windows-fix';
import json from 'rollup-plugin-json';
import loadz0r from 'rollup-plugin-loadz0r';
import resolve from '@rollup/plugin-node-resolve';

Error.stackTraceLimit = Infinity;

export default {
  input: 'auth.js',
  output: {
    dir: 'dist',
    format: 'amd',
  },
  external: [],
  plugins: [
    hypothetical({
      allowFallthrough: true,
      allowRealFiles: true,
      files: {
        'fast-png': 'export const encode = {}; export const decode = {};',
        fs: 'export const promises = {};',
        gl: 'const dummy = {}; export default dummy;',
        'node-fetch': 'export default {};',
        os: '',
        tty: '',
      },
    }),
    loadz0r(),
    babel({
      babelrc: false,
      exclude: [/node_modules/, /polybooljs/],
      presets: [
        '@babel/preset-react',
        ['@babel/env', { targets: { browsers: 'last 1 chrome versions' } }],
      ],
      plugins: [
        '@babel/transform-react-jsx',
        '@babel/plugin-proposal-class-properties',
      ],
    }),
    commonjs({
      namedExports: {
        '../../node_modules/binpackingjs/dist/BinPacking.min.js': ['BP2D'],
      },
    }),
    json(),
    resolve({ jsnext: true, preferBuiltins: true }),
  ],
};
