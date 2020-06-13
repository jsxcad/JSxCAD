import Shape from '@jsxcad/api-v1-shape';
import { dot } from '@jsxcad/math-vec3';
import faceConnector from './faceConnector';
import { toPlane } from '@jsxcad/geometry-surface';

const Y = 1;

export const front = (shape) =>
  shape.connector('front') ||
  faceConnector(
    shape,
    'front',
    (surface) => dot(toPlane(surface), [0, -1, 0, 0]),
    (point) => -point[Y]
  );

const frontMethod = function () {
  return front(this);
};
Shape.prototype.front = frontMethod;

front.signature = 'front(shape:Shape) -> Shape';
frontMethod.signature = 'Shape -> front() -> Shape';
