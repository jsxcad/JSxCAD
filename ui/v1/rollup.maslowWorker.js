import commonjs from '@rollup/plugin-commonjs';
import hypothetical from 'rollup-plugin-hypothetical-windows-fix';
import loadz0r from 'rollup-plugin-loadz0r';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'maslowWorker.js',
  output: {
    dir: 'dist',
    format: 'amd',
  },
  plugins: [
    loadz0r(),
    replace({
      __dirname: '""',
    }),
    hypothetical({
      allowFallthrough: true,
      allowRealFiles: true,
      files: {
        '../../algorithm/clipper/mediator.js':
          "import lib from './mediator-for-rollup.js'; export default lib;",
      },
    }),
    commonjs(),
    resolve({ preferBuiltins: true, mainFields: ['main'] }),
  ],
};
