import Shape from './Shape.js';

export const mask =
  (...args) =>
  (shape) =>
    shape.and(...args.map((arg) => Shape.toShape(arg, shape).void()));

Shape.registerMethod('mask', mask);

export default mask;
