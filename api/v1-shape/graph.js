import { getSolids, taggedGraph, taggedGroup } from '@jsxcad/geometry-tagged';

import Shape from './Shape.js';
import { fromSolid } from '@jsxcad/geometry-graph';

// FIX: Remove after graphs are properly integrated.

export const graph = (shape) => {
  const graphs = [];
  for (const { tags, solid } of getSolids(shape.toTransformedGeometry())) {
    graphs.push(taggedGraph(tags, fromSolid(solid)));
  }
  return Shape.fromGeometry(taggedGroup({}, ...graphs));
};

const graphMethod = function () { return graph(this); };
Shape.prototype.graph = graphMethod;
