import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { identityMatrix } from '@jsxcad/math-mat4';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';
import { transformSurfaceMesh } from '@jsxcad/algorithm-cgal';

// FIX: Remove this function.
export const transform = (geometry) => {
  if (!geometry.matrix || geometry.matrix === identityMatrix) {
    return geometry;
  } else {
    return taggedGraph(
      { tags: geometry.tags, matrix: identityMatrix },
      fromSurfaceMeshLazy(
        transformSurfaceMesh(toSurfaceMesh(geometry.graph), geometry.matrix)
      )
    );
  }
};
