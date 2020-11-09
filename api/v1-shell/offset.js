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

export const offset = (shape, amount = -1) => {
  if (amount < 0) {
    return inset(shape, -amount);
  } else {
    return shape;
  }
};

const offsetMethod = function (amount) {
  return offset(this, amount);
};

Shape.prototype.offset = offsetMethod;

// FIX: Support minimal radius requirements.
export const inset = (shape, initial = 1, step, limit) => {
  const group = [];
  for (const { tags, graph } of getNonVoidGraphs(shape.toDisjointGeometry())) {
    const outlinedGraph = outlineGraph(graph);
    let amount = initial;
    for (;;) {
      const offsettedGraph = offsetGraph(outlinedGraph, -amount);
      if (offsettedGraph.isEmpty) {
        break;
      }
      group.push(taggedGraph({ tags }, offsettedGraph));
      if (step === undefined) {
        break;
      }
      amount += step;
      if (amount >= limit) {
        break;
      }
    }
  }
  return Shape.fromGeometry(taggedGroup({}, ...group));
};

const insetMethod = function (initial, step, limit) {
  return inset(this, initial, step, limit);
};

Shape.prototype.inset = insetMethod;

export default offset;
