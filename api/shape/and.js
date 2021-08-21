import Shape from './Shape.js';
import { taggedGroup } from '@jsxcad/geometry';

export const and =
  (...args) =>
  (shape) =>
    Shape.fromGeometry(
      taggedGroup(
        {},
        shape.toGeometry(),
        ...args.map((arg) => Shape.toShape(arg, shape).toGeometry())
      )
    );

Shape.registerMethod('and', and);

export default and;
