import Shape from './Shape.js';
import { fromRotation } from '@jsxcad/math-mat4';

export const rotate =
  (angle = 0, axis = [0, 0, 1]) =>
  (shape) =>
    shape.transform(fromRotation(angle * 0.017453292519943295, axis));

Shape.registerMethod('rotate', rotate);

export default rotate;
