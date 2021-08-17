import Shape from './Shape.js';
import { taggedGroup } from '@jsxcad/geometry';

const toGeometry = (to, from) => {
  if (to instanceof Function) {
    return to(from).toGeometry();
  } else {
    return to.toGeometry();
  }
};

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
