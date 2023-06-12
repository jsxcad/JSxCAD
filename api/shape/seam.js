import Shape from './Shape.js';
import { seam as seamGeometry } from '@jsxcad/geometry';

export const seam = Shape.registerMethod2(
  'seam',
  ['inputGeometry', 'geometries'],
  (geometry, selections) =>
    Shape.fromGeometry(seamGeometry(geometry, selections))
);
