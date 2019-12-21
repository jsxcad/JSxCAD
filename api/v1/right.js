import Shape from './Shape';
import { dot } from '@jsxcad/math-vec3';
import faceConnector from './faceConnector';
import { toPlane } from '@jsxcad/geometry-surface';

const X = 0;

export const right = (shape) =>
  faceConnector(shape, (surface) => dot(toPlane(surface), [1, 0, 0, 0]), (point) => point[X]);

const rightMethod = function () { return right(this); };
Shape.prototype.right = rightMethod;

right.signature = 'right(shape:Shape) -> Shape';
rightMethod.signature = 'Shape -> right() -> Shape';
