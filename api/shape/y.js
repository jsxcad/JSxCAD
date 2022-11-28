import Group from './Group.js';
import Shape from './Shape.js';
import move from './move.js';

export const y = Shape.registerMethod('y', (...y) => async (shape) => {
  const moved = [];
  for (const offset of await shape.toFlatValues(y)) {
    moved.push(await move([0, offset, 0])(shape));
  }
  return Group(...moved);
});
