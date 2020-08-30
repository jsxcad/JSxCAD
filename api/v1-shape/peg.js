import { fromPoints, toXYPlaneTransforms } from '@jsxcad/math-plane';

import Shape from './Shape.js';
import { getPeg } from '@jsxcad/geometry-tagged';
import { subtract } from '@jsxcad/math-vec3';

const getAngle = ([aX, aY], [bX, bY]) => {
  const a2 = Math.atan2(aX, aY); // 0
  const a1 = Math.atan2(bX, bY);
  const sign = a1 > a2 ? 1 : -1;
  const angle = a1 - a2; // a1
  const K = -sign * Math.PI * 2;
  const absoluteAngle =
    Math.abs(K + angle) < Math.abs(angle) ? K + angle : angle;
  return (absoluteAngle * 180) / Math.PI;
};

export const peg = (shape, shapeToPeg) => {
  const coords = getPeg(shape.toTransformedGeometry());
  const origin = coords.slice(0, 3);
  const forward = coords.slice(3, 6);
  const right = coords.slice(6, 9);

  const plane = fromPoints(right, forward, origin);
  const [, from] = toXYPlaneTransforms(plane);
  const orientation = subtract(right, origin);
  const angle = getAngle([1, 0], orientation);
  return shapeToPeg
    .move(...origin)
    .rotateZ(-angle)
    .transform(from);
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
