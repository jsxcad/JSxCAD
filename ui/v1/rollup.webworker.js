import '@babel/plugin-proposal-class-properties';
import '@babel/plugin-transform-react-jsx';
import '@babel/preset-env';
import '@babel/preset-react';

import babel from 'rollup-plugin-babel';
import builtins from 'rollup-plugin-node-builtins';
import commonjs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import hypothetical from 'rollup-plugin-hypothetical-windows-fix';
import json from 'rollup-plugin-json';
import loadz0r from 'rollup-plugin-loadz0r';
import nodeResolve from 'rollup-plugin-node-resolve';
import sizes from 'rollup-plugin-sizes';

Error.stackTraceLimit = Infinity;

export default {
  input: 'webworker.js',
  output: {
    file: 'dist.es6/webworker.amd.js',
    format: 'amd'
  },
  external: [],
  plugins: [
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
          'tty': ''
        }
      }),
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
        '../../node_modules/binpackingjs/dist/BinPacking.min.js': ['BP2D'],
        '../../node_modules/opentype.js/dist/opentype.js': ['parse'],
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
      }
    }),
    globals(),
    json(),
    nodeResolve({ mainFields: ['main'], preferBuiltins: true }),
    sizes()
  ]
};
