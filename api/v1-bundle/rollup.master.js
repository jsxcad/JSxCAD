// rollup.config.js
import babel from 'rollup-plugin-babel';
import builtins from 'rollup-plugin-node-builtins';
import commonjs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import hypothetical from 'rollup-plugin-hypothetical';
import loadz0r from 'rollup-plugin-loadz0r';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: 'master.js',
  output: {
    dir: 'webworker.dist',
    format: 'amd'
  },
  external: [],
  plugins: [
    loadz0r(),
    builtins(),
    babel({
      babelrc: false,
      exclude: [/node_modules/, /polybooljs/],
      presets: ['@babel/preset-react',
                ['@babel/env', { 'targets': { 'browsers': 'last 1 chrome versions' } }]],
      plugins: [
        '@babel/transform-react-jsx',
        '@babel/plugin-proposal-class-properties'
      ]
    }),
    commonjs({
      namedExports: {
        '../../node_modules/react/index.js': [
          'Children', 'Component', 'PropTypes', 'createElement', 'cloneElement', 'createContext',
          'useRef', 'useState', 'useCallback', 'useEffect', 'useMemo', 'useContext', 'useReducer'
        ],
        '../../node_modules/react-dom/index.js': [
          'findDOMNode'
        ]
      }
    }),
    globals(),
    hypothetical(
      {
        allowFallthrough: true,
        files: {
          'fs': 'export const promises = {};',
          'node-fetch': 'export default {};',
          'os': '',
          'tty': ''
        }
      }),
    nodeResolve({ jsnext: true, preferBuiltins: true })
  ]
};
