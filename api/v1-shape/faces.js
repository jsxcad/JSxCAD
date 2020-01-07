import Shape from './Shape';
import assemble from './assemble';
import { getSolids } from '@jsxcad/geometry-tagged';

export const faces = (shape, op = (x => x)) => {
  const faces = [];
  for (const { solid } of getSolids(shape.toKeptGeometry())) {
    for (const surface of solid) {
      const face = Shape.fromGeometry({ surface });
      faces.push(op(face));
    }
  }
  return assemble(...faces);
};

const facesMethod = function (...args) { return faces(this, ...args); };
Shape.prototype.faces = facesMethod;

export default faces;
