import builtins from 'rollup-plugin-node-builtins';
import commonjs from '@rollup/plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import hypothetical from 'rollup-plugin-hypothetical';
import nodeResolve from '@rollup/plugin-node-resolve';

Error.stackTraceLimit = Infinity;

export default {
  input: 'main.js',
  output: {
    dir: 'dist',
    format: 'module',
  },
  external(id) {
    return id.startsWith('./jsxcad-');
  },
  plugins: [
    hypothetical({
      allowFallthrough: true,
      allowRealFiles: true,
      files: {
        './self.js': '/* global self */\nexport default self;',
        './broadcast-channel.js':
          "export { BroadcastChannel } from 'broadcast-channel';",
        'node-fetch':
          'export const AbortError = undefined; export default _ => _;',
        './nodeWorker.js': 'export const nodeWorker = () => {};',
        './eval.js': `export { evalScript } from './browserEval.js';`,
        './document.js': '',
        v8: 'export default {};',
      },
    }),
    builtins(),
    commonjs({ transformMixedEsModules: true }),
    globals(),
    nodeResolve({ preferBuiltins: true, browser: true }),
    {
      transform(code, id) {
        return code.replace(/'@jsxcad\/([^']*)'/g, "'./jsxcad-$1.js'");
      },
    },
  ],
};
