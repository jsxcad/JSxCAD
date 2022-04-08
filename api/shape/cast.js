import Point from './Point.js';
import Shape from './Shape.js';
import { cast as castGeometry } from '@jsxcad/geometry';

export const cast =
  (plane = [0, 0, 1, 0], reference = Point()) =>
  (shape) =>
    Shape.fromGeometry(
      castGeometry(
        shape.toGeometry(),
        Shape.toShape(reference, shape).toGeometry()
      )
    );

Shape.registerMethod('cast', cast);

export default cast;
