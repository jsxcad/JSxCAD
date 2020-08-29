import { fromPoint, toXYPlaneTransforms } from '@jsxcad/math-plane';

import Shape from './Shape.js';
import { getPeg } from '@jsxcad/geometry-tagged';

export const peg = (shape, shapeToPeg) => {
  const [x, y, z, u, v, d] = getPeg(shape.toGeometry());
  const plane = fromPoint([0, 0, 0, u, v, d]);
  const [, from] = toXYPlaneTransforms(plane);
  return shapeToPeg.transform(from).move(x, y, z);
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
