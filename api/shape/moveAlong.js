import Shape from './Shape.js';
import { normal } from './normal.js';

const scale = (amount, [x = 0, y = 0, z = 0]) => [
  x * amount,
  y * amount,
  z * amount,
];

export const moveAlong = Shape.chainable((direction, ...offsets) => (shape) => {
  direction = shape.toCoordinate(direction);
  offsets = offsets.map((extent) => Shape.toValue(extent, shape));
  offsets.sort((a, b) => a - b);
  const moves = [];
  while (offsets.length > 0) {
    const offset = offsets.pop();
    moves.push(shape.move(scale(offset, direction)));
  }
  return Shape.Group(...moves);
});

export const m = Shape.chainable(
  (...offsets) =>
    (shape) =>
      shape.moveAlong(normal(), ...offsets)
);

Shape.registerMethod('m', m);
Shape.registerMethod('moveAlong', moveAlong);

export default moveAlong;
