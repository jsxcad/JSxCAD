import Shape from './Shape.js';

import { fromPathsToGraph } from '@jsxcad/geometry';

export const Polygon = (...points) => {
  const path = [];
  for (const point of points) {
    point.eachPoint((p) => path.push(p));
  }
  return Shape.fromGraph(fromPathsToGraph([{ points: path }]));
};

export default Polygon;

Shape.prototype.Polygon = Shape.shapeMethod(Polygon);
