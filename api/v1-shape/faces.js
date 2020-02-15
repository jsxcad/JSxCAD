import Shape from './Shape';
import assemble from './assemble';
import { getSolids } from '@jsxcad/geometry-tagged';
import { makeConvex } from '@jsxcad/geometry-surface';
import { outline } from '@jsxcad/geometry-solid';

export const faces = (shape, op = (x => x)) => {
  const faces = [];
  for (const { solid } of getSolids(shape.toKeptGeometry())) {
    for (const loop of outline(solid)) {
      const face = Shape.fromGeometry({ surface: makeConvex([loop]) });
      faces.push(op(face, faces.length));
    }
  }
  return assemble(...faces);
};

const facesMethod = function (...args) { return faces(this, ...args); };
Shape.prototype.faces = facesMethod;

export default faces;
