import builtins from 'rollup-plugin-node-builtins';
import cjs from 'rollup-plugin-cjs-es';
import commonjs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import hypothetical from 'rollup-plugin-hypothetical';
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
        './getCgal.js': `export { getCgal, initCgal } from './getWasmCgal.js';`,
      },
    }),
    builtins(),
    commonjs(),
    globals(),
    nodeResolve({ preferBuiltins: true }),
    {
      transform(code, id) {
        return code.replace(/'@jsxcad\/([^']*)'/g, "'./jsxcad-$1.js'");
      },
    },
    cjs({ nested: true }),
  ],
};
