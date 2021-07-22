import Group from './Group.js';
import Shape from './Shape.js';

export const op =
  (...fns) =>
  (shape) =>
    Group(...fns.map((fn) => fn(shape)));

export const withOp =
  (...fns) =>
  (shape) =>
    shape.with(shape.op(...fns));

Shape.registerMethod('op', op);
Shape.registerMethod('withOp', withOp);
