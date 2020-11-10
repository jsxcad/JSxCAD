import { fromPoints, toXYPlaneTransforms } from '@jsxcad/math-plane';

import Shape from './Shape.js';
import { getPeg } from '@jsxcad/geometry-tagged';
import { subtract } from '@jsxcad/math-vec3';

export const getPegCoords = (shape) => {
  const coords = getPeg(shape.toTransformedGeometry());
  const origin = coords.slice(0, 3);
  const forward = coords.slice(3, 6);
  const right = coords.slice(6, 9);
  const plane = fromPoints(right, forward, origin);

  return { coords, origin, forward, right, plane };
};

export const orient = (origin, forward, right, shapeToPeg) => {
  const plane = fromPoints(right, forward, origin);
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

export const shapeMethod = (build) => {
  return function (...args) {
    return this.peg(build(...args));
  };
};
