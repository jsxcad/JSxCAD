import { ConvexHull, convexHull } from '@jsxcad/geometry';
import Shape from './Shape.js';

export const Hull = Shape.registerMethod3('Hull', ['geometries'], ConvexHull);

export const hull = Shape.registerMethod3(
  'hull',
  ['inputGeometry', 'geometries'],
  convexHull
);

export default Hull;
