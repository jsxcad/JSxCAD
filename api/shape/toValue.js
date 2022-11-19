import Shape from './Shape.js';

export const toValue = Shape.registerMethod('toValue', (to) => async (shape) => {
  if (Shape.isFunction(to)) {
    to = await to(shape);
  }
  return to;
});
