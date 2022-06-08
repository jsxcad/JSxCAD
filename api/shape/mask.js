import Group from './Group.js';
import Shape from './Shape.js';
import { hasTypeMasked } from '@jsxcad/geometry';

export const mask = Shape.chainable(
  (...args) =>
    (shape) =>
      Group(
        ...args.map((arg) => Shape.toShape(arg, shape).void()),
        Shape.fromGeometry(hasTypeMasked(shape.toGeometry()))
      )
);

Shape.registerMethod('mask', mask);

export default mask;
