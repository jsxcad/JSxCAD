import Shape from './Shape.js';
import { move } from './move.js';
import { normal } from './normal.js';

const scale = (amount, [x = 0, y = 0, z = 0]) => [
  x * amount,
  y * amount,
  z * amount,
];

export const moveAlong = Shape.registerMethod(
  'moveAlong',
  (direction, ...offsets) =>
    async (shape) => {
      direction = await shape.toCoordinate(direction);
      const deltas = [];
      for (const offset of offsets) {
        deltas.push(await shape.toValue(offset));
      }
      deltas.sort((a, b) => a - b);
      const moves = [];
      while (deltas.length > 0) {
        const delta = deltas.pop();
        moves.push(await shape.move(scale(delta, direction)));
      }
      return Shape.Group(...moves);
    }
);

export const m = Shape.registerMethod(
  'm',
  (...offsets) =>
    (shape) =>
      shape.moveAlong(normal(), ...offsets)
);

export default moveAlong;
