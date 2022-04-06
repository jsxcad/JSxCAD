import Shape from './Shape.js';
import { loft as loftGeometry } from '@jsxcad/geometry';

export const Loop = (...shapes) =>
  Shape.fromGeometry(
    loftGeometry(
      shapes.map((shape) => shape.toGeometry()),
      /* closed= */ false
    )
  );

Shape.prototype.Loop = Shape.shapeMethod(Loop);
Shape.Loop = Loop;

export default Loop;

export const loop =
  (...shapes) =>
  (shape) =>
    Loop(shape, ...shape.toShapes(shapes));

Shape.registerMethod('loop', loop);
