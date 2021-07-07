import Shape from './Shape.js';
import { fromRotation } from '@jsxcad/math-mat4';

export const rotate =
  (turn = 0, axis = [0, 0, 1]) =>
  (shape) =>
    shape.transform(fromRotation(turn * Math.PI * 2, axis));

Shape.registerMethod('rotate', rotate);

export default rotate;
