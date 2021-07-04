import Shape from './Shape.js';
import { fromTranslation } from '@jsxcad/math-mat4';

export const move =
  (x = 0, y = 0, z = 0) =>
  (shape) => {
    if (!isFinite(x)) {
      x = 0;
    }
    if (!isFinite(y)) {
      y = 0;
    }
    if (!isFinite(z)) {
      z = 0;
    }
    return shape.transform(fromTranslation([x, y, z]));
  };

Shape.registerMethod('move', move);

export default move;
