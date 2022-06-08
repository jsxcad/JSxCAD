import Group from './Group.js';
import Shape from './Shape.js';

export const op = Shape.chainable(
  (...fns) =>
    (shape) =>
      Group(
        ...fns
          .filter((fn) => fn)
          .map((fn) => (fn instanceof Function ? fn(shape) : fn))
      )
);

Shape.registerMethod('op', op);
