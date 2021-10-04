import Shape from './Shape.js';

import { convexHullToGraph } from '@jsxcad/geometry';

export const Hull = (...shapes) => {
  const points = [];
  shapes.forEach((shape) => shape.eachPoint((point) => points.push(point)));
  return Shape.fromGeometry(convexHullToGraph({}, points));
};

Shape.prototype.Hull = Shape.shapeMethod(Hull);

const hull =
  (...shapes) =>
  (shape) =>
    Hull(shape, ...shapes.map((other) => Shape.toShape(other, shape)));

Shape.registerMethod('hull', hull);

export default Hull;
