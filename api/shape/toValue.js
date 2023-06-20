/*
import Shape from './Shape.js';

export const toValue = Shape.registerMethod(
  'toValue',
  (to) => async (shape) => {
    while (Shape.isFunction(to)) {
      to = await to(shape);
    }
    return to;
  }
);
*/
