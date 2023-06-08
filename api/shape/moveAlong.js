import Group from './Group.js';
import Shape from './Shape.js';
import { normal } from './normal.js';

const scale = (amount, [x = 0, y = 0, z = 0]) => [
  x * amount,
  y * amount,
  z * amount,
];

export const moveAlong = Shape.registerMethod2(
  'moveAlong',
  ['input', 'coordinate', 'numbers'],
  async (input, direction, deltas) => {
    const moves = [];
    for (const delta of deltas) {
      moves.push(await input.move(scale(delta, direction)));
    }
    return Group(...moves);
  }
);

export const m = Shape.registerMethod2(
  'm',
  ['input', 'numbers'],
  (input, offsets) => input.moveAlong(normal(), ...offsets)
);

export default moveAlong;
