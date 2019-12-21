import Shape from './Shape';
import { dot } from '@jsxcad/math-vec3';
import faceConnector from './faceConnector';
import { toPlane } from '@jsxcad/geometry-surface';

const Z = 2;

export const bottom = (shape) =>
  faceConnector(shape, (surface) => dot(toPlane(surface), [0, 0, -1, 0]), (point) => -point[Z]);

const bottomMethod = function () { return bottom(this); };
Shape.prototype.bottom = bottomMethod;

bottom.signature = 'bottom(shape:Shape) -> Shape';
bottomMethod.signature = 'Shape -> bottom() -> Shape';
