import Group from './Group.js';
import Shape from './Shape.js';
import { scale } from './scale.js';

export const scaleZ = Shape.registerMethod(
  ['scaleZ', 'sz'],
  (...z) =>
    async (shape) => {
      const scaled = [];
      for (const value of await shape.toFlatValues(z)) {
        scaled.push(await scale(1, 1, value)(shape));
      }
      return Group(...scaled);
    }
);

export const sz = scaleZ;
