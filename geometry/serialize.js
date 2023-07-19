import { linearize } from './tagged/linearize.js';
import { serialize as serializeWithCgal } from '@jsxcad/algorithm-cgal';

const filter = (geometry) =>
  geometry.type === 'graph' && !geometry.graph.serializedSurfaceMesh;

export const serialize = (geometry) => {
  const inputs = [];
  linearize(geometry, filter, inputs, /* includeSketches= */ true);
  if (inputs.length === 0) {
    return geometry;
  }
  serializeWithCgal(inputs);
  return geometry;
};
