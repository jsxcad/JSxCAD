import {
  fromSurfaceMesh,
  reverseFaceOrientationsOfSurfaceMesh,
} from '@jsxcad/algorithm-cgal';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const reverseFaceOrientations = (geometry) =>
  taggedGraph(
    { tags: geometry.tags },
    fromSurfaceMesh(
      reverseFaceOrientationsOfSurfaceMesh(
        toSurfaceMesh(geometry.graph),
        geometry.matrix
      )
    )
  );
