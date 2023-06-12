import Group from './Group.js';
import Shape from './Shape.js';
import { scale } from './scale.js';

export const scaleX = Shape.registerMethod2(
  ['scaleX', 'sx'],
  ['input', 'numbers'],
  async (input, values) => {
    const scaled = [];
    for (const value of values) {
      scaled.push(await scale(value, 1, 1)(input));
    }
    return Group(...scaled);
  }
);

export const sx = scaleX;
