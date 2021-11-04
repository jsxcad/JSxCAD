import { fromPolygonsToSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { taggedGraph } from '../tagged/taggedGraph.js';

export const fromTriangles = ({ tags, matrix }, triangles) =>
  taggedGraph(
    { tags, matrix },
    fromSurfaceMeshLazy(fromPolygonsToSurfaceMesh(triangles))
  );
