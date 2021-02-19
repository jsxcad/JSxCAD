import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { reverseFaceOrientationsOfSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const reverseFaceOrientations = (graph) =>
  fromSurfaceMeshLazy(
    reverseFaceOrientationsOfSurfaceMesh(toSurfaceMesh(graph))
  );
