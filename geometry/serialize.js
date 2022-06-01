import {
  deletePendingSurfaceMeshes,
  serialize as serializeWithCgal,
} from '@jsxcad/algorithm-cgal';

import { linearize } from './tagged/linearize.js';
import { toConcreteGeometry } from './tagged/toConcreteGeometry.js';

const filter = (geometry) =>
  geometry.type === 'graph' && !geometry.graph.serializedSurfaceMesh;

export const serialize = (geometry) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter, inputs, /* includeSketches= */ true);
  if (inputs.length === 0) {
    return geometry;
  }
  serializeWithCgal(inputs);
  deletePendingSurfaceMeshes();
  return geometry;
};
