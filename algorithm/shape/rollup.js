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
    '@jsxcad/cache',
    '@jsxcad/data-shape',
    '@jsxcad/geometry-path',
    '@jsxcad/geometry-points',
    '@jsxcad/geometry-polygons',
    '@jsxcad/geometry-solid',
    '@jsxcad/geometry-surface',
    '@jsxcad/geometry-tagged',
    '@jsxcad/math-plane',
    '@jsxcad/math-poly3',
    '@jsxcad/math-utils',
    '@jsxcad/math-vec2',
    '@jsxcad/math-vec3'
  ],
  plugins: [
    builtins(),
    commonjs({
      namedExports: {
        './../node_modules/adaptive-bezier-curve/index.js': ['bezier']
      }
    }),
    globals(),
    nodeResolve({ preferBuiltins: true })
  ]
};
