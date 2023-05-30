import Shape from './Shape.js';
import { computeCentroid } from '@jsxcad/geometry';

export const center = Shape.registerMethod2(
  'center',
  ['inputGeometry'],
  (geometry) => Shape.fromGeometry(computeCentroid(geometry))
);

export default center;
