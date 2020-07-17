import { getSolids, taggedPaths } from '@jsxcad/geometry-tagged';

import Shape from './Shape.js';
import assemble from './assemble.js';
import { findOpenEdges } from '@jsxcad/geometry-solid';

export const openEdges = (shape, { isOpen = true } = {}) => {
  const r = (v) => v;
  const paths = [];
  for (const { solid } of getSolids(shape.toKeptGeometry())) {
    paths.push(...findOpenEdges(solid, isOpen));
  }
  return Shape.fromGeometry(
    taggedPaths(
      {},
      paths.map((path) => path.map(([x, y, z]) => [r(x), r(y), r(z)]))
    )
  );
};

const openEdgesMethod = function (...args) {
  return openEdges(this, ...args);
};
Shape.prototype.openEdges = openEdgesMethod;

const withOpenEdgesMethod = function (...args) {
  return assemble(this, openEdges(this, ...args));
};
Shape.prototype.withOpenEdges = withOpenEdgesMethod;

export default openEdges;
