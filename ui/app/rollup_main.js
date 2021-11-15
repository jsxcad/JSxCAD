import '@babel/plugin-proposal-class-properties';
import '@babel/plugin-transform-react-jsx';
import '@babel/preset-env';
import '@babel/preset-react';

import alias from '@rollup/plugin-alias';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import hypothetical from 'rollup-plugin-hypothetical-windows-fix';
import json from 'rollup-plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import sizes from 'rollup-plugin-sizes';

export const watcher = {
  transform(code, id) {
    console.log(`\n\n==============================`);
    console.log(id);
    console.log(`==============================\n\n`);
    console.log(code);
    // not returning anything, so doesn't affect bundle
  },
};

export default {
  input: 'App.js',
  output: {
    file: 'dist/main.js',
    format: 'module',
  },
  external(id) {
    return id.startsWith('./jsxcad-');
  },
  plugins: [
    babel({
      babelrc: false,
      exclude: [/node_modules/, /polybooljs/],
      presets: [
        '@babel/preset-react',
        ['@babel/env', { targets: { browsers: 'last 1 chrome versions' } }],
      ],
      plugins: [
        ['@babel/transform-react-jsx', { pragma: 'h' }],
        [
          'babel-plugin-jsx-pragmatic',
          {
            module: 'preact',
            import: 'h',
            export: 'h',
          },
        ],
        '@babel/plugin-proposal-class-properties',
      ],
    }),
    commonjs({
      namedExports: {
        '../../node_modules/react/index.js': [
          'Children',
          'Component',
          'PropTypes',
          'createElement',
          'cloneElement',
          'createContext',
          'forwardRef',
          'isFragment',
          'useCallback',
          'useEffect',
          'useImperativeHandle',
          'useMemo',
          'useContext',
          'useReducer',
          'useRef',
          'useState',
        ],
        '../../node_modules/react-dom/index.js': ['findDOMNode'],
        '../../node_modules/react-recollect/index.js': ['collect'],
        '../../node_modules/fast-equals/dist/fast-equals.js': ['deepEqual'],
        '../../node_modules/react-draggable/build/web/react-draggable.min.js': [
          'DraggableCore',
        ],
      },
    }),
    // globals(),
    hypothetical({
      allowFallthrough: true,
      allowRealFiles: true,
      files: {
        'fast-png': 'export const encode = {}; export const decode = {};',
        fs: 'export const promises = {};',
        gl: 'const dummy = {}; export default dummy;',
        'node-fetch': 'export default {};',
        os: '',
        tty: '',
        '@blueprintjs/core': '',
        '@blueprintjs/icons': '',
        crypto: `
            let rnds = new Array(16);
            export const randomBytes = () => {
              for (let i = 0, r; i < 16; i++) {
                if ((i & 0x03) === 0) {
                  r = Math.random() * 0x100000000;
                }
                rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
              }
              return rnds;
            }`,
      },
    }),
    // builtins(),
    // resolve({ preferBuiltins: true, browser: true }),
    alias({
      entries: [
        { find: 'react', replacement: 'preact/compat' },
        { find: 'react-dom', replacement: 'preact/compat' },
      ],
    }),
    resolve({ browser: true }),
    json(),
    {
      transform(code, id) {
        return code.replace(/'@jsxcad\/([^']*)'/g, "'./jsxcad-$1.js'");
      },
    },
    {
      transform(code, id) {
        return code.replace(/process.env.NODE_ENV/g, "'development'");
      },
    },
    {
      transform(code, id) {
        // FIX: Remove this nasty patch and fix ace properly.
        return code
          .replace(
            /var first = Math.min[(]this.firstRow, config.firstRow[)];/,
            'var first = Math.min(this.firstRow, config.firstRow, 0);'
          )
          .replace(
            /var rowCount = w.h [/] config.lineHeight;/,
            'var rowCount = Math.ceil(w.h / config.lineHeight);'
          )
          .replace(
            /w.rowCount = w.pixelHeight [/] renderer.layerConfig.lineHeight/,
            'w.rowCount = Math.ceil(w.pixelHeight / renderer.layerConfig.lineHeight)'
          );
      },
    },
    sizes(),
  ],
};
