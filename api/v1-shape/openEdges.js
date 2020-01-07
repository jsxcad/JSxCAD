import { alignVertices, findOpenEdges } from '@jsxcad/geometry-solid';

import Shape from './Shape';
import { getSolids } from '@jsxcad/geometry-tagged';

export const openEdges = (shape, { isOpen = true } = {}) => {
  const paths = [];
  for (const { solid } of getSolids(shape.toKeptGeometry())) {
    paths.push(...findOpenEdges(alignVertices(solid), isOpen));
  }
  return Shape.fromGeometry({ paths });
};

const openEdgesMethod = function (...args) { return openEdges(this, ...args); };
Shape.prototype.openEdges = openEdgesMethod;

export default openEdges;
