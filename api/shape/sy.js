import Group from './Group.js';
import Shape from './Shape.js';
import { scale } from './scale.js';

export const scaleY = Shape.registerMethod2(
  ['scaleY', 'sy'],
  ['input', 'numbers'],
  async (input, values) => {
    const scaled = [];
    for (const value of values) {
      scaled.push(await scale(1, value, 1)(input));
    }
    return Group(...scaled);
  }
);

export const sy = scaleY;
