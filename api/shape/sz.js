import Group from './Group.js';
import Shape from './Shape.js';
import { scale } from './scale.js';

export const scaleZ = Shape.registerMethod2(
  ['scaleZ', 'sz'],
  ['input', 'numbers'],
  async (input, values) => {
    const scaled = [];
    for (const value of values) {
      scaled.push(await scale(1, 1, value)(input));
    }
    return Group(...scaled);
  }
);

export const sz = scaleZ;
