import Group from './Group.js';
import Shape from './Shape.js';
import move from './move.js';

export const y = Shape.registerMethod2(
  'y',
  ['input', 'numbers'],
  async (input, offsets) => {
    const moved = [];
    for (const offset of offsets) {
      moved.push(await move([0, offset, 0])(input));
    }
    return Group(...moved);
  }
);
