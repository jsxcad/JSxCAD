import {
  getNonVoidGraphs,
  getNonVoidSolids,
  getNonVoidSurfaces,
  realize,
  taggedGraph,
  taggedGroup,
  taggedPaths,
} from '@jsxcad/geometry-tagged';

import { Shape } from './Shape.js';

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
  for (const geometry of getNonVoidGraphs(shape.toKeptGeometry())) {
    const { graph } = realize(geometry);
    pieces.push(taggedGraph({}, { ...graph, isWireframe: true }));
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
