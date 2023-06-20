/*
import Shape from './Shape.js';

export const toNestedValues = Shape.registerMethod(
  'toNestedValues',
  (to) => async (shape) => {
    if (Shape.isFunction(to)) {
      to = await to(shape);
    }
    if (Shape.isArray(to)) {
      const expanded = [];
      for (const value of to) {
        if (Shape.isFunction(value)) {
          expanded.push(...(await value(shape)));
        } else {
          expanded.push(value);
        }
      }
      return expanded;
    } else {
      return to;
    }
  }
);
*/
