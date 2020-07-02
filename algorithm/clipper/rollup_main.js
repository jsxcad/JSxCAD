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
        './mediator.js':
          "import lib from './mediator-for-rollup.js'; export default lib;",
      },
    }),
    builtins(),
    commonjs({
      namedExports: {
        './js-angusj-clipperjs-web/index.cjs': [
          'ClipType',
          'NativeClipperLibRequestedFormat',
          'PolyFillType',
          'PolyTree',
          'loadNativeClipperLibInstanceAsync',
        ],
      },
    }),
    globals(),
    nodeResolve({ preferBuiltins: true }),
    {
      transform(code, id) {
        return code.replace(/'@jsxcad\/([^']*)'/g, "'./jsxcad-$1.js'");
      },
    },
  ],
};
