import Group from './Group.js';
import Shape from './Shape.js';
import move from './move.js';

export const z = Shape.registerMethod2(
  'z',
  ['input', 'numbers'],
  async (input, offsets) => {
    const moved = [];
    for (const offset of offsets) {
      moved.push(await move([0, 0, offset])(input));
    }
    return Group(...moved);
  }
);
