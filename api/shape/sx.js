import Group from './Group.js';
import Shape from './Shape.js';
import { scale } from './scale.js';

export const scaleX = Shape.registerMethod(
  ['scaleX', 'sx'],
  (...x) =>
    async (shape) => {
      const scaled = [];
      for (const value of await shape.toFlatValues(x)) {
        scaled.push(await scale(value, 1, 1)(shape));
      }
      return Group(...scaled);
    }
);

export const sx = scaleX;
