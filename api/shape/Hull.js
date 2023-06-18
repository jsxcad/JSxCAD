import Shape from './Shape.js';
import { convexHull } from '@jsxcad/geometry';

export const Hull = Shape.registerMethod2(
  'Hull',
  ['geometries'],
  (geometries) => Shape.fromGeometry(convexHull(geometries))
);

export const hull = Shape.registerMethod2(
  'hull',
  ['inputGeometry', 'geometries'],
  (geometry, geometries) =>
    Shape.fromGeometry(convexHull([geometry, ...geometries]))
);

export default Hull;
