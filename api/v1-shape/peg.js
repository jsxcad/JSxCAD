import { dot, subtract } from '@jsxcad/math-vec3';

import { fromPoints, toXYPlaneTransforms } from '@jsxcad/math-plane';

import Shape from './Shape.js';
import { getPeg } from '@jsxcad/geometry-tagged';

const normalizeCoords = ([
  x = 0,
  y = 0,
  z = 0,
  fX = 0,
  fY = 1,
  fZ = 0,
  rX = 1,
  rY = 0,
  rZ = 0,
]) => [x, y, z, fX, fY, fZ, rX, rY, rZ];

export const getPegCoords = (shape) => {
  const coords =
    shape.constructor === Shape
      ? getPeg(shape.toTransformedGeometry())
      : normalizeCoords(shape);
  const origin = coords.slice(0, 3);
  const forward = coords.slice(3, 6);
  const right = coords.slice(6, 9);
  const plane = fromPoints(right, forward, origin);

  return { coords, origin, forward, right, plane };
};

// See also:
// https://gist.github.com/kevinmoran/b45980723e53edeb8a5a43c49f134724

export const orient = (origin, forward, right, shapeToPeg) => {
  const plane = fromPoints(right, forward, origin);
  const d = Math.abs(dot(plane, [0, 0, 1, 0]));
  if (d >= 0.99999) {
    return shapeToPeg.move(...origin);
  }
  const rightDirection = subtract(right, origin);
  const [, from] = toXYPlaneTransforms(plane, rightDirection);
  return shapeToPeg.transform(from).move(...origin);
};

export const peg = (shape, shapeToPeg) => {
  const { origin, right, forward } = getPegCoords(shape);
  return orient(origin, right, forward, shapeToPeg);
};

const pegMethod = function (shapeToPeg) {
  return peg(this, shapeToPeg);
};

Shape.prototype.peg = pegMethod;

const atMethod = function (pegShape) {
  return peg(pegShape, this);
};

Shape.prototype.at = atMethod;

export const shapeMethod = (build) => {
  return function (...args) {
    return this.peg(build(...args));
  };
};
