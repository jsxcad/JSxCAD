import builtins from 'rollup-plugin-node-builtins';
import commonjs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import hypothetical from 'rollup-plugin-hypothetical-windows-fix';
import loadz0r from 'rollup-plugin-loadz0r';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: 'maslowWorker.js',
  output: {
    dir: 'dist',
    format: 'amd',
  },
  plugins: [
    loadz0r(),
    hypothetical({
      allowFallthrough: true,
      allowRealFiles: true,
      files: {
        '../../algorithm/clipper/mediator.js':
          "import lib from './mediator-for-rollup.js'; export default lib;",
      },
    }),
    commonjs(),
    globals(),
    builtins(),
    nodeResolve({ preferBuiltins: true, mainFields: ['main'] }),
  ],
};
