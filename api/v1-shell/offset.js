import {
  getNonVoidGraphs,
  taggedGraph,
  taggedGroup,
} from '@jsxcad/geometry-tagged';

import {
  offset as offsetGraph,
  outline as outlineGraph,
} from '@jsxcad/geometry-graph';

import { Shape } from '@jsxcad/api-v1-shape';

export const offset = (shape, amount = 1) => {
  const group = [];
  if (amount < 0) {
    for (const { tags, graph } of getNonVoidGraphs(
      shape.toDisjointGeometry()
    )) {
      const outlinedGraph = outlineGraph(graph);
      const offsettedGraph = offsetGraph(outlinedGraph, amount);
      group.push(taggedGraph({ tags }, offsettedGraph));
    }
  }
  return Shape.fromGeometry(taggedGroup({}, ...group));
};

const offsetMethod = function (amount) {
  return offset(this, amount);
};
Shape.prototype.offset = offsetMethod;

export default offset;
