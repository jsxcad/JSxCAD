import Group from './Group.js';
import Shape from './Shape.js';
import { scale } from './scale.js';

export const scaleY = Shape.registerMethod(
  ['scaleY', 'sy'],
  (...y) =>
    async (shape) => {
      const scaled = [];
      for (const value of await shape.toFlatValues(y)) {
        scaled.push(await scale(1, value, 1)(shape));
      }
      return Group(...scaled);
    }
);

export const sy = scaleY;
