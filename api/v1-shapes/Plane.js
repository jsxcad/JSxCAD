import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import { toPolygon } from '@jsxcad/math-plane';

// These are just excessively large polygons, which approximate planes.
export const Plane = (plane = [0, 0, 1, 0]) =>
  Shape.fromPathToSurface(toPolygon(plane));

export default Plane;

Shape.prototype.Plane = shapeMethod(Plane);
