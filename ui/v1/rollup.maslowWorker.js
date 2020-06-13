// rollup.config.js
import builtins from 'rollup-plugin-node-builtins';
import commonjs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import hypothetical from 'rollup-plugin-hypothetical-windows-fix';
import json from 'rollup-plugin-json';
import loadz0r from 'rollup-plugin-loadz0r';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: 'maslowWorker.js',
  output: {
    dir: 'dist',
    format: 'amd',
  },
  external: [],
  plugins: [
    loadz0r(),
    builtins(),
    commonjs({
      namedExports: {
        '../../node_modules/react-dom/index.js': ['findDOMNode'],
        '../../node_modules/react-recollect/index.js': ['collect'],
        '../../node_modules/fast-equals/dist/fast-equals.js': ['deepEqual'],
        '../../node_modules/react-draggable/build/web/react-draggable.min.js': [
          'DraggableCore',
        ],
        '../../node_modules/opentype.js/dist/opentype.js': ['parse'],
        '../../node_modules/bin-packing-es/build/bin-packing.js': [
          'GrowingPacker',
          'Packer',
        ],
        '../../node_modules/acorn/dist/acorn.js': ['parse'],
        '../../node_modules/acorn-walk/dist/walk.js': ['recursive'],
        '../../node_modules/three/build/three.js': [
          'AmbientLight',
          'BackSide',
          'Box2',
          'Box3',
          'BufferGeometry',
          'Camera',
          'Color',
          'DirectionalLight',
          'DoubleSide',
          'FaceColors',
          'Float32BufferAttribute',
          'FrontSide',
          'Frustum',
          'Geometry',
          'GridHelper',
          'Object3D',
          'Light',
          'Line',
          'LineBasicMaterial',
          'LineSegments',
          'Matrix3',
          'Matrix4',
          'Mesh',
          'MeshNormalMaterial',
          'PerspectiveCamera',
          'Points',
          'PointsMaterial',
          'Scene',
          'Sprite',
          'Vector2',
          'Vector3',
          'Vector4',
          'VertexColors',
        ],
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
      },
    }),
    globals(),
    json(),
    hypothetical({
      allowFallthrough: true,
      allowRealFiles: true,
      files: {
        'fast-png': 'export const encode = {}; export const decode = {};',
        fs: 'export const promises = {};',
        gl: 'const dummy = {}; export default dummy;',
        'node-fetch': 'export default {};',
        os: '',
        v8: '',
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
    nodeResolve({ mainFields: ['main'], preferBuiltins: true, browser: true }),
  ],
};
