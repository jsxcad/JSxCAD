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
      Hull(...shape.toShapes(shapes))
);

Shape.registerMethod('hull', hull);

export default Hull;
