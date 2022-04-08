import Shape from './Shape.js';
import { link as linkGeometry } from '@jsxcad/geometry';

export const Loop = (...shapes) =>
  Shape.fromGeometry(
    linkGeometry(
      Shape.toShapes(shapes).map((shape) => shape.toGeometry()),
      /* close= */ true
    )
  );

Shape.prototype.Loop = Shape.shapeMethod(Loop);
Shape.Loop = Loop;

export default Loop;

export const loop =
  (...shapes) =>
  (shape) =>
    Loop(shape, ...shape.toShapes(shapes, shape));

Shape.registerMethod('loop', loop);
