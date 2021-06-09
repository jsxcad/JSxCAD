import { fromPolygonsToSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { taggedGraph } from '../tagged/taggedGraph.js';

export const fromTriangles = ({ tags }, triangles) =>
  taggedGraph(
    { tags },
    fromSurfaceMeshLazy(fromPolygonsToSurfaceMesh(triangles))
  );
