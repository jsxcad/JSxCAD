import {
  getNonVoidGraphs,
  getNonVoidSolids,
  getNonVoidSurfaces,
  taggedGroup,
  taggedPaths,
} from '@jsxcad/geometry-tagged';

import { Shape } from './Shape.js';
import { toPaths as toPathsFromGraph } from '@jsxcad/geometry-graph';

const toWireframeFromSolid = (solid) => {
  const paths = [];
  for (const surface of solid) {
    paths.push(...surface);
  }
  return taggedPaths({}, paths);
};

const toWireframeFromSurface = (surface) => {
  return taggedPaths({}, surface);
};

export const wireframe = (options = {}, shape) => {
  const pieces = [];
  for (const { graph } of getNonVoidGraphs(shape.toKeptGeometry())) {
    pieces.push(toPathsFromGraph(graph));
  }
  for (const { solid } of getNonVoidSolids(shape.toKeptGeometry())) {
    pieces.push(toWireframeFromSolid(solid));
  }
  for (const { surface } of getNonVoidSurfaces(shape.toKeptGeometry())) {
    pieces.push(toWireframeFromSurface(surface));
  }
  return Shape.fromGeometry(taggedGroup({}, ...pieces));
};

const method = function (options) {
  return wireframe(options, this);
};

Shape.prototype.wireframe = method;
Shape.prototype.withWireframe = function (options) {
  return this.and(wireframe(options, this));
};
