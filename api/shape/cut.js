import Shape from './Shape.js';
import { difference } from '@jsxcad/geometry';
import { toGeometry } from './toGeometry.js';

export const cut =
  (...shapes) =>
  (shape) =>
    Shape.fromGeometry(
      difference(
        shape.toGeometry(),
        ...shapes.map((other) => toGeometry(other, shape))
      )
    );

Shape.registerMethod('cut', cut);
