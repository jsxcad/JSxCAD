import Shape from './Shape.js';
import { push as pushGeometry } from '@jsxcad/geometry';

export const push = (
  shape,
  force = 0.1,
  minimumDistance = 1,
  maximumDistance = 10
) =>
  Shape.fromGeometry(
    pushGeometry(shape.toGeometry(), {
      force,
      minimumDistance,
      maximumDistance,
    })
  );

const pushMethod = function (force = 0.1, minimumDistance, maximumDistance) {
  return push(this, force, minimumDistance, maximumDistance);
};

Shape.prototype.push = pushMethod;
