import Shape from './Shape.js';
import { push as pushGeometry } from '@jsxcad/geometry';

export const push =
  (force = 0.1, minimumDistance = 1, maximumDistance = 10) =>
  (shape) =>
    Shape.fromGeometry(
      pushGeometry(shape.toGeometry(), {
        force,
        minimumDistance,
        maximumDistance,
      })
    );

Shape.registerMethod('push', push);
