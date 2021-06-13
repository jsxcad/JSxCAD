import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import { convexHullToGraph } from '@jsxcad/geometry';

export const Hull = (...shapes) => {
  const points = [];
  shapes.forEach((shape) => shape.eachPoint((point) => points.push(point)));
  return Shape.fromGeometry(convexHullToGraph({}, points));
};

const hullMethod = function (...shapes) {
  return Hull(this, ...shapes);
};

Shape.prototype.Hull = shapeMethod(Hull);
Shape.prototype.hull = hullMethod;

export default Hull;
