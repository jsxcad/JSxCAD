import { fromSolid, toSolid as toSolidFromGraph } from '@jsxcad/geometry-graph';
import {
  getGraphs,
  getSolids,
  taggedGraph,
  taggedGroup,
  taggedSolid,
} from '@jsxcad/geometry-tagged';

import Shape from './Shape.js';

// FIX: Remove after graphs are properly integrated.

export const toGraph = (shape) => {
  const graphs = [];
  for (const { tags, solid } of getSolids(shape.toTransformedGeometry())) {
    graphs.push(taggedGraph({ tags }, fromSolid(solid)));
  }
  return Shape.fromGeometry(taggedGroup({}, ...graphs));
};

const toGraphMethod = function () {
  return toGraph(this);
};
Shape.prototype.toGraph = toGraphMethod;

export const toSolid = (shape) => {
  const solids = [];
  for (const { tags, graph } of getGraphs(shape.toTransformedGeometry())) {
    solids.push(taggedSolid({ tags }, toSolidFromGraph(graph)));
  }
  return Shape.fromGeometry(taggedGroup({}, ...solids));
};

const toSolidMethod = function () {
  return toSolid(this);
};
Shape.prototype.toSolid = toSolidMethod;
