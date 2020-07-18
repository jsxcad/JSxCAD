import { getSolids, taggedPaths } from '@jsxcad/geometry-tagged';

import Shape from './Shape.js';
import assemble from './assemble.js';

export const wireframeFaces = (shape, op = (x) => x) => {
  const faces = [];
  for (const { solid } of getSolids(shape.toKeptGeometry())) {
    for (const surface of solid) {
      for (const path of surface) {
        faces.push(
          op(Shape.fromGeometry(taggedPaths({}, [path])), faces.length)
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
