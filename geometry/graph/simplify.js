import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { simplifySurfaceMesh } from '@jsxcad/algorithm-cgal';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const simplify = (geometry, resolution) =>
  taggedGraph(
    { tags: geometry.tags, matrix: geometry.matrix },
    fromSurfaceMeshLazy(
      simplifySurfaceMesh(toSurfaceMesh(geometry.graph), resolution)
    )
  );
