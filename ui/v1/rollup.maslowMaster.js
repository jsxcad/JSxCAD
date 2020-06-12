// rollup.config.js
import babel from "rollup-plugin-babel";
import builtins from "rollup-plugin-node-builtins";
import commonjs from "rollup-plugin-commonjs";
import globals from "rollup-plugin-node-globals";
import hypothetical from "rollup-plugin-hypothetical-windows-fix";
import loadz0r from "rollup-plugin-loadz0r";
import nodeResolve from "rollup-plugin-node-resolve";

export const watcher = {
  transform(code, id) {
    console.log(id);
    console.log(code);
    // not returning anything, so doesn't affect bundle
  },
};

export default {
  input: "maslowMaster.js",
  output: {
    dir: "dist",
    format: "amd",
  },
  external: [],
  plugins: [
    // watcher,
    hypothetical({
      allowFallthrough: true,
      allowRealFiles: true,
      files: {
        "fast-png": "export const encode = {}; export const decode = {};",
        fs: "export const promises = {};",
        gl: "const dummy = {}; export default dummy;",
        "node-fetch": "export default {};",
        os: "",
        tty: "",
        "@blueprintjs/core": "",
        "@blueprintjs/icons": "",
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
    loadz0r(),
    builtins(),
    babel({
      babelrc: false,
      exclude: [/node_modules/, /polybooljs/],
      presets: [
        "@babel/preset-react",
        ["@babel/env", { targets: { browsers: "last 1 chrome versions" } }],
      ],
      plugins: [
        "@babel/transform-react-jsx",
        "@babel/plugin-proposal-class-properties",
      ],
    }),
    commonjs({
      namedExports: {
        "../../node_modules/react/index.js": [
          "Children",
          "Component",
          "PropTypes",
          "createElement",
          "cloneElement",
          "createContext",
          "useRef",
          "useState",
          "useCallback",
          "useEffect",
          "useMemo",
          "useContext",
          "useReducer",
        ],
        "../../node_modules/react-dom/index.js": ["findDOMNode"],
        "../../node_modules/react-recollect/index.js": ["collect"],
      },
    }),
    globals(),
    nodeResolve({ preferBuiltins: true }),
  ],
};
