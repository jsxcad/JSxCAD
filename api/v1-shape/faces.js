import Shape from './Shape.js';
import assemble from './assemble.js';
import { getSolids } from '@jsxcad/geometry-tagged';
import { outline } from '@jsxcad/geometry-surface';

export const faces = (shape, op = (x) => x) => {
  const faces = [];
  for (const { solid } of getSolids(shape.toKeptGeometry())) {
    for (const surface of solid) {
      faces.push(
        op(Shape.fromGeometry({ paths: outline(surface) }), faces.length)
      );
    }
  }
  return assemble(...faces);
};

const facesMethod = function (...args) {
  return faces(this, ...args);
};
Shape.prototype.faces = facesMethod;

export default faces;
