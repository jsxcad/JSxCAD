import { getAnySurfaces, getSolids } from '@jsxcad/geometry-tagged';

import Shape from './Shape';
import { findOpenEdges } from '@jsxcad/geometry-solid';

export const openEdges = (shape, { isOpen = true } = {}) => {
  const r = (v) => v;
  const paths = [];
  for (const { solid } of getSolids(shape.toKeptGeometry())) {
    paths.push(...findOpenEdges(solid, isOpen));
  }
  for (const { surface, z0Surface } of getAnySurfaces(shape.toKeptGeometry())) {
    paths.push(...findOpenEdges([surface || z0Surface], isOpen));
  }
  return Shape.fromGeometry({ paths: paths.map(path => path.map(([x, y, z]) => [r(x), r(y), r(z)])) });
};

const openEdgesMethod = function (...args) { return openEdges(this, ...args); };
Shape.prototype.openEdges = openEdgesMethod;

export default openEdges;
