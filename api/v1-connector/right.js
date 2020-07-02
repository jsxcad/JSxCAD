import Shape from '@jsxcad/api-v1-shape';
import { dot } from '@jsxcad/math-vec3';
import faceConnector from './faceConnector.js';
import { toPlane } from '@jsxcad/geometry-surface';

const X = 0;

export const right = (shape) =>
  shape.connector('right') ||
  faceConnector(
    shape,
    'right',
    (surface) => dot(toPlane(surface), [1, 0, 0, 0]),
    (point) => point[X]
  );

const rightMethod = function () {
  return right(this);
};
Shape.prototype.right = rightMethod;

right.signature = 'right(shape:Shape) -> Shape';
rightMethod.signature = 'Shape -> right() -> Shape';
