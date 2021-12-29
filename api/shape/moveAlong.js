import Shape from './Shape.js';
import { normal } from './normal.js';
import { scale } from '@jsxcad/math-vec3';

export const moveAlong =
  (direction, ...offsets) =>
  (shape) => {
    direction = shape.toCoordinate(direction);
    offsets = offsets.map((extent) => Shape.toValue(extent, shape));
    offsets.sort((a, b) => a - b);
    const moves = [];
    while (offsets.length > 0) {
      const offset = offsets.pop();
      moves.push(shape.move(scale(offset, direction)));
    }
    return Shape.Group(...moves);
  };

export const m = (...offsets) => moveAlong(normal(), ...offsets);

Shape.registerMethod('m', m);
Shape.registerMethod('moveAlong', moveAlong);

export default moveAlong;
