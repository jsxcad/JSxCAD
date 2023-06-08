import Group from './Group.js';
import Shape from './Shape.js';
import move from './move.js';

export const x = Shape.registerMethod2(
  'x',
  ['input', 'numbers'],
  async (input, offsets) => {
    const moved = [];
    for (const offset of offsets) {
      moved.push(await move([offset, 0, 0])(input));
    }
    return Group(...moved);
  }
);
