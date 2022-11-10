import Group from './Group.js';
import Shape from './Shape.js';

export const op = Shape.registerMethod(
  'op',
  (...fns) =>
    (shape) =>
      Group(
        ...fns
          .filter((fn) => fn)
          .map((fn) => (fn instanceof Function ? fn(shape) : fn))
      )
);
