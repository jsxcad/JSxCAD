import builtins from 'rollup-plugin-node-builtins';
import commonjs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import hypothetical from 'rollup-plugin-hypothetical-windows-fix';
import nodeResolve from 'rollup-plugin-node-resolve';

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
        './dexie-observable-shim.js': "import './dexie-observable.es.js';",
        'node-fetch': 'export default _ => _;',
        './nodeWorker.js': 'export const nodeWorker = () => {};',
        v8: 'export default {};',
      },
    }),
    builtins(),
    commonjs(),
    globals(),
    nodeResolve({ preferBuiltins: true, browser: true }),
    {
      transform(code, id) {
        return code.replace(/'@jsxcad\/([^']*)'/g, "'./jsxcad-$1.js'");
      },
    },
  ],
};
