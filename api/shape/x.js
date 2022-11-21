import Group from './Group.js';
import Shape from './Shape.js';
import move from './move.js';

export const x = Shape.registerMethod('x', (...x) => async (shape) => {
  const moved = [];
  for (const offset of await shape.toFlatValues(x)) {
    moved.push(await move([offset, 0, 0])(shape));
  }
  return Group(...moved);
});
