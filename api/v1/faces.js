import Shape from './Shape';
import { getSolids } from '@jsxcad/geometry-tagged';

export const faces = (shape, xform = (_ => _)) => {
  const faces = [];
  for (const { solid } of getSolids(shape.toKeptGeometry())) {
    for (const surface of solid) {
      for (const face of surface) {
        faces.push(xform(face));
      }
    }
  }
  return faces;
};

const facesMethod = function (...args) { return faces(this, ...args); };
Shape.prototype.faces = facesMethod;

export default faces;
