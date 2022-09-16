import { hash, taggedGraph } from '@jsxcad/geometry';

import Shape from './Shape.js';
import { computeHash } from '@jsxcad/sys';

export const SurfaceMesh = (
  serializedSurfaceMesh,
  { isClosed = true, matrix } = {}
) => {
  const geometry = taggedGraph(
    { tags: [], matrix },
    { serializedSurfaceMesh, isClosed }
  );
  geometry.graph.hash = computeHash(geometry.graph);
  hash(geometry);
  return Shape.fromGeometry(geometry);
};

export default SurfaceMesh;
