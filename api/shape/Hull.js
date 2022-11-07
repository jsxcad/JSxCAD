import Shape from './Shape.js';
import { convexHull } from '@jsxcad/geometry';

export const Hull = Shape.registerShapeMethod('Hull', (...shapes) =>
  Shape.fromGeometry(
    convexHull(shapes.map((other) => Shape.toShape(other).toGeometry()))
  ));

export const hull = Shape.registerMethod('hull', Shape.chainable(
  (...shapes) =>
    (shape) =>
      Hull(...shape.toShapes(shapes))
));

export default Hull;
