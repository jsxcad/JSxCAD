import { getSolids, taggedSurface } from '@jsxcad/geometry-tagged';

import Shape from './Shape.js';

export const faces = (shape, op = (x) => x) => {
  const faces = [];
  for (const { solid } of getSolids(shape.toKeptGeometry())) {
    for (const surface of solid) {
      faces.push(
        op(Shape.fromGeometry(taggedSurface({}, surface)), faces.length)
      );
    }
  }
  return faces;
};

const facesMethod = function (...args) {
  return faces(this, ...args);
};
Shape.prototype.faces = facesMethod;

export default faces;
