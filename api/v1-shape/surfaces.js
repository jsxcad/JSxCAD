import Shape from './Shape.js';
import { getAnyNonVoidSurfaces } from '@jsxcad/geometry-tagged';

export const surfaces = (shape, op = (_) => _) => {
  const surfaces = [];
  for (const surface of getAnyNonVoidSurfaces(shape.toDisjointGeometry())) {
    surfaces.push(op(Shape.fromGeometry(surface)));
  }
  return surfaces;
};

const surfacesMethod = function (op) {
  return surfaces(this, op);
};
Shape.prototype.surfaces = surfacesMethod;

export default surfaces;
