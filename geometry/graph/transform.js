import { fromSurfaceMesh, transformSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { identityMatrix } from '@jsxcad/math-mat4';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

// FIX: Remove this function.
export const transform = (geometry) => {
  if (!geometry.matrix || geometry.matrix === identityMatrix) {
    return geometry;
  } else {
    return taggedGraph(
      { tags: geometry.tags, matrix: identityMatrix },
      fromSurfaceMesh(
        transformSurfaceMesh(toSurfaceMesh(geometry.graph), geometry.matrix)
      )
    );
  }
};
