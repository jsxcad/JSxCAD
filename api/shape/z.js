import Group from './Group.js';
import Shape from './Shape.js';
import move from './move.js';

export const z = Shape.registerMethod(
  'z',
  (...z) =>
    async (shape) => {
      const moved = [];
      for (const offset of await shape.toFlatValues(z)) {
        moved.push(await move([0, 0, offset])(shape));
      }
      return Group(...moved);
    }
);
