import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import { toPolygon } from '@jsxcad/math-plane';

// These are just excessively large polygons, which approximate planes.
export const Plane = (x = 0, y = 0, z = 1, w = 0) =>
  Shape.fromPathToSurface(toPolygon([x, y, z, w]));

export default Plane;

Shape.prototype.Plane = shapeMethod(Plane);
