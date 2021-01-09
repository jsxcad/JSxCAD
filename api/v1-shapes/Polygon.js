import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import { fromPaths } from '@jsxcad/geometry-graph';

export const Polygon = (...points) => {
  const path = [];
  for (const point of points) {
    point.eachPoint((p) => path.push(p));
  }
  return Shape.fromGraph(fromPaths([path]));
};

export default Polygon;

Shape.prototype.Polygon = shapeMethod(Polygon);
