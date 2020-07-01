import Shape from './Shape';
import assemble from './assemble';
import { getSolids } from '@jsxcad/geometry-tagged';

export const wireframeFaces = (shape, op = (x) => x) => {
  const faces = [];
  for (const { solid } of getSolids(shape.toKeptGeometry())) {
    for (const surface of solid) {
      for (const path of surface) {
        faces.push(
          op(Shape.fromGeometry({ type: 'paths', paths: [path] }), faces.length)
        );
      }
    }
  }
  return assemble(...faces);
};

const wireframeFacesMethod = function (...args) {
  return wireframeFaces(this, ...args);
};
Shape.prototype.wireframeFaces = wireframeFacesMethod;

export default wireframeFaces;
