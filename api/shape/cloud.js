import { Shape } from './Shape.js';
import { samplePointCloud } from '@jsxcad/geometry';

export const cloud = Shape.registerMethod3(
  'cloud',
  ['inputGeometry', 'geometries', 'number'],
  (geometry, geometries, resolution) =>
    samplePointCloud([geometry, ...geometries], resolution)
);

export const Cloud = Shape.registerMethod3(
  'Cloud',
  ['geometries', 'number'],
  samplePointCloud
);
