import Group from './Group.js';
import Shape from './Shape.js';

export const copy = Shape.registerMethod('copy', (count) => async (shape) => {
  const copies = [];
  const limit = await shape.toValue(count);
  for (let nth = 0; nth < limit; nth++) {
    copies.push(shape);
  }
  return Group(...copies);
});
