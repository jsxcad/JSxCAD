import { convexHullToGraph, eachPoint } from '@jsxcad/geometry';

import Shape from './Shape.js';

export const Hull = (...shapes) => {
  const points = [];
  for (const shape of shapes) {
    if (!shape) {
      continue;
    }
    eachPoint((point) => points.push(point), shape.toGeometry());
  }
  return Shape.fromGeometry(convexHullToGraph({}, points));
};

Shape.prototype.Hull = Shape.shapeMethod(Hull);

const hull =
  (...shapes) =>
  (shape) =>
    Hull(shape, ...shapes.map((other) => Shape.toShape(other, shape)));

Shape.registerMethod('hull', hull);

export default Hull;
