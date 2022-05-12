import Group from './Group.js';
import Shape from './Shape.js';

export const op =
  (...fns) =>
  (shape) =>
    Group(
      ...fns
        .filter((fn) => fn)
        .map((fn) => (fn instanceof Function ? fn(shape) : fn))
    );

export const withOp =
  (...fns) =>
  (shape) =>
    shape.with(shape.op(...fns));

Shape.registerMethod('op', op);
Shape.registerMethod('withOp', withOp);
