import Shape from './Shape.js';
import { toShape } from './toShape.js';

export const mask =
  (...args) =>
  (shape) =>
    shape.and(...args.map((arg) => toShape(arg, shape).void()));

Shape.registerMethod('mask', mask);

export default mask;
