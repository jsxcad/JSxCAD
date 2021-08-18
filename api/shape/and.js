import Shape from './Shape.js';
import { taggedGroup } from '@jsxcad/geometry';
import { toGeometry } from './toGeometry.js';

export const and =
  (...args) =>
  (shape) =>
    Shape.fromGeometry(
      taggedGroup(
        {},
        shape.toGeometry(),
        ...args.map((arg) => toGeometry(arg, shape))
      )
    );

Shape.registerMethod('and', and);

export default and;
