import Shape from './Shape.js';
import { taper as taperGeometry } from '@jsxcad/geometry';

export const taper =
  (
    xPlusFactor = 1,
    xMinusFactor = 1,
    yPlusFactor = 1,
    yMinusFactor = 1,
    zPlusFactor = 1,
    zMinusFactor = 1
  ) =>
  (shape) =>
    Shape.fromGeometry(
      taperGeometry(
        shape.toGeometry(),
        xPlusFactor,
        xMinusFactor,
        yPlusFactor,
        yMinusFactor,
        zPlusFactor,
        zMinusFactor
      )
    );

Shape.registerMethod('taper', taper);
