import builtins from 'rollup-plugin-node-builtins';
import commonjs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import nodeResolve from 'rollup-plugin-node-resolve';

Error.stackTraceLimit = Infinity;

export default {
  input: 'main.js',
  output: {
    dir: 'dist',
    format: 'module'
  },
  external: [
    '@jsxcad/algorithm-color',
    '@jsxcad/algorithm-shape',
    '@jsxcad/geometry-path',
    '@jsxcad/geometry-paths',
    '@jsxcad/geometry-surface',
    '@jsxcad/geometry-tagged',
    '@jsxcad/geometry-z0surface',
    '@jsxcad/math-mat4',
    '@jsxcad/math-utils',
    '@jsxcad/math-vec2'
  ],
  plugins: [
    builtins(),
    commonjs({
      namedExports: {
        '../../node_modules/simplify-path/index.js': ['default']
      }
    }),
    globals(),
    nodeResolve({ preferBuiltins: true })
  ]
};
