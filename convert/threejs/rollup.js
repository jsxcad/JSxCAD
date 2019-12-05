import builtins from 'rollup-plugin-node-builtins';
import commonjs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import hypothetical from 'rollup-plugin-hypothetical-windows-fix';
import nodeResolve from 'rollup-plugin-node-resolve';

Error.stackTraceLimit = Infinity;

export const watcher = {
  transform (code, id) {
    console.log(id);
    console.log(code);
  }
};

export default {
  input: 'main.js',
  output: {
    dir: 'dist',
    format: 'module'
  },
  external (id) {
    return id.startsWith('./jsxcad-');
  },
  plugins: [
    // watcher,
    hypothetical(
      {
        allowFallthrough: true,
        allowRealFiles: true,
        files: {
          'gl': 'const dummy = {}; export default dummy;'
        }
      }),
    builtins(),
    commonjs({
      namedExports: {
        './../node_modules/adaptive-bezier-curve/index.js': ['bezier']
      }
    }),
    globals(),
    nodeResolve({ preferBuiltins: true }),
    { transform (code, id) { return code.replace(/'@jsxcad\/([^']*)'/g, "'./jsxcad-$1.js'"); } }
  ]
};
