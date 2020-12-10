import {
  fromPaths,
  fromSolid,
  fromSurface,
  toSolid as toSolidFromGraph,
} from '@jsxcad/geometry-graph';

import {
  getAnySurfaces,
  getGraphs,
  getPaths,
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
  for (const { tags, surface, z0Surface } of getAnySurfaces(
    shape.toTransformedGeometry()
  )) {
    graphs.push(taggedGraph({ tags }, fromSurface(surface || z0Surface)));
  }
  for (const { tags, paths } of getPaths(shape.toTransformedGeometry())) {
    graphs.push(taggedGraph({ tags }, fromPaths(paths)));
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
