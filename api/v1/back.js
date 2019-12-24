import Shape from './Shape';
import { dot } from '@jsxcad/math-vec3';
import faceConnector from './faceConnector';
import { toPlane } from '@jsxcad/geometry-surface';

const Y = 1;

export const back = (shape) =>
  faceConnector(shape, 'back', (surface) => dot(toPlane(surface), [0, 1, 0, 0]), (point) => point[Y]);

const backMethod = function () { return back(this); };
Shape.prototype.back = backMethod;

back.signature = 'back(shape:Shape) -> Shape';
backMethod.signature = 'Shape -> back() -> Shape';
