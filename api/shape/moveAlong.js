import Group from './Group.js';
import Shape from './Shape.js';
import { destructure2 } from './destructure.js';
import { normal } from './normal.js';

const scale = (amount, [x = 0, y = 0, z = 0]) => [
  x * amount,
  y * amount,
  z * amount,
];

export const moveAlong = Shape.registerMethod(
  'moveAlong',
  (...args) =>
    async (shape) => {
      const [direction, deltas] = await destructure2(
        shape,
        args,
        'coordinate',
        'numbers'
      );
      const moves = [];
      for (const delta of deltas) {
        moves.push(await shape.move(scale(delta, direction)));
      }
      return Group(...moves);
    }
);

export const m = Shape.registerMethod(
  'm',
  (...offsets) =>
    (shape) =>
      shape.moveAlong(normal(), ...offsets)
);

export default moveAlong;
