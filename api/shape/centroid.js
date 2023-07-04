import Shape from './Shape.js';
import { computeCentroid as op } from '@jsxcad/geometry';

export const centroid = Shape.registerMethod3(
  'centroid',
  ['inputGeometry'],
  op
);

export default centroid;
