import {
  approximateSurfaceMesh,
  simplifySurfaceMesh,
} from '@jsxcad/algorithm-cgal';

import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const simplify = (geometry, options) => {
  const { method = 'simplify' } = options;
  switch (method) {
    case 'simplify':
      return taggedGraph(
        { tags: geometry.tags, matrix: geometry.matrix },
        fromSurfaceMeshLazy(
          simplifySurfaceMesh(
            toSurfaceMesh(geometry.graph),
            geometry.matrix,
            options
          )
        )
      );
    case 'approximate':
      return taggedGraph(
        { tags: geometry.tags, matrix: geometry.matrix },
        fromSurfaceMeshLazy(
          approximateSurfaceMesh(
            toSurfaceMesh(geometry.graph),
            geometry.matrix,
            options
          )
        )
      );
    default:
      throw Error(`Unknown simplify method ${method}`);
  }
};
