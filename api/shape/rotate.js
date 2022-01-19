import Shape from './Shape.js';
import { fromRotation } from '@jsxcad/math-mat4';

// FIX: Move this to cgal.
export const rotate =
  (turn = 0, axis = [0, 0, 1]) =>
  (shape) => {
    const matrix = fromRotation(turn * Math.PI * 2, axis);
    // FIX: Move to cgal.
    matrix.blessed = true;
    return shape.transform(matrix);
  };

Shape.registerMethod('rotate', rotate);

export default rotate;
