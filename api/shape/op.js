import Group from './Group.js';
import Shape from './Shape.js';

export const op = Shape.registerMethod('op', (...fns) => async (shape) => {
  const results = [];
  for (const fn of fns) {
    if (fn === undefined) {
      continue;
    }
    if (Shape.isFunction(fn)) {
      results.push(fn(shape));
    } else {
      results.push(fn);
    }
  }
  return Group(...results);
});
