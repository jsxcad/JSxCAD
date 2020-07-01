import Shape from './Shape';
import assemble from './assemble';
import { findOpenEdges } from '@jsxcad/geometry-solid';
import { getSolids } from '@jsxcad/geometry-tagged';

export const openEdges = (shape, { isOpen = true } = {}) => {
  const r = (v) => v;
  const paths = [];
  for (const { solid } of getSolids(shape.toKeptGeometry())) {
    paths.push(...findOpenEdges(solid, isOpen));
  }
  return Shape.fromGeometry({
    type: 'paths',
    paths: paths.map((path) => path.map(([x, y, z]) => [r(x), r(y), r(z)])),
  });
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
