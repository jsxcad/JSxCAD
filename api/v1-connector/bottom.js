import Shape from '@jsxcad/api-v1-shape';
import { dot } from '@jsxcad/math-vec3';
import faceConnector from './faceConnector.js';
import { toPlane } from '@jsxcad/geometry-surface';

const Z = 2;

export const bottom = (shape) =>
  shape.connector('bottom') ||
  faceConnector(
    shape,
    'bottom',
    (surface) => dot(toPlane(surface), [0, 0, -1, 0]),
    (point) => -point[Z]
  );

const bottomMethod = function () {
  return bottom(this);
};
Shape.prototype.bottom = bottomMethod;

bottom.signature = 'bottom(shape:Shape) -> Shape';
bottomMethod.signature = 'Shape -> bottom() -> Shape';
