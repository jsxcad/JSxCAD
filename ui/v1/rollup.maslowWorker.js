// rollup.config.js
import builtins from 'rollup-plugin-node-builtins';
import commonjs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import hypothetical from 'rollup-plugin-hypothetical-windows-fix';
import json from 'rollup-plugin-json';
import loadz0r from 'rollup-plugin-loadz0r';
import nodeResolve from 'rollup-plugin-node-resolve';

export const watcher = {
  transform (code, id) {
    console.log(id);
    console.log(code);
    // not returning anything, so doesn't affect bundle
  }
};

export default {
  input: 'maslowWorker.js',
  output: {
    dir: 'dist',
    format: 'amd'
  },
  external: [],
  plugins: [
    // watcher,
    loadz0r(),
    builtins(),
    commonjs({
      namedExports: {
        '../../node_modules/binpackingjs/dist/BinPacking.min.js': ['BP2D'],
        '../../node_modules/bin-packing-core/lib/index.js': ['MaxRectBinPack'],
        '../../node_modules/opentype.js/dist/opentype.js': ['parse'],
        '../../node_modules/three/build/three.js': [
          'AmbientLight', 'BackSide', 'Box2', 'Box3', 'BufferGeometry', 'Camera', 'Color', 'DirectionalLight',
          'DoubleSide', 'FaceColors', 'Float32BufferAttribute', 'FrontSide', 'Frustum', 'Geometry', 'GridHelper',
          'Object3D', 'Light', 'Line', 'LineBasicMaterial', 'LineSegments', 'Matrix3', 'Matrix4', 'Mesh',
          'MeshNormalMaterial', 'PerspectiveCamera', 'Points', 'PointsMaterial', 'Scene', 'Sprite', 'Vector2',
          'Vector3', 'Vector4', 'VertexColors'
        ]
      }
    }),
    globals(),
    json(),
    hypothetical(
      {
        allowFallthrough: true,
        allowRealFiles: true,
        files: {
          'fast-png': 'export const encode = {}; export const decode = {};',
          'fs': 'export const promises = {};',
          'gl': 'const dummy = {}; export default dummy;',
          'node-fetch': 'export default {};',
          'os': '',
          'tty': '',
          '@blueprintjs/core': '',
          '@blueprintjs/icons': '',
          'crypto': `
            let rnds = new Array(16);
            export const randomBytes = () => {
              for (let i = 0, r; i < 16; i++) {
                if ((i & 0x03) === 0) {
                  r = Math.random() * 0x100000000;
                }
                rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
              }
              return rnds;
            }`
        }
      }),
    nodeResolve({ mainFields: ['main'], preferBuiltins: true })
  ]
};
