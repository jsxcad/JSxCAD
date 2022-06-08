import Shape from './Shape.js';
import { convexHull } from '@jsxcad/geometry';

export const Hull = (...shapes) =>
  Shape.fromGeometry(
    convexHull(shapes.map((other) => Shape.toShape(other).toGeometry()))
  );

Shape.prototype.Hull = Shape.shapeMethod(Hull);

export const hull = Shape.chainable(
  (...shapes) =>
    (shape) =>
      Hull(...shapes.map((other) => Shape.toShape(other, shape)))
);

Shape.registerMethod('hull', hull);

export default Hull;
