import Group from './Group.js';
import Shape from './Shape.js';

export const op = Shape.registerMethod('op', (...fns) => async (shape) => {
  const results = [];
  for (const fn of fns) {
    if (fn === undefined) {
      continue;
    }
    if (Shape.isShape(fn)) {
      results.push(fn);
    } else {
      const result = await fn(Shape.chain(shape));
      results.push(result);
    }
  }
  return Group(...results);
});
