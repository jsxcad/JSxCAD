import {
  fromPolygonsToSurfaceMesh,
  fromSurfaceMesh,
} from '@jsxcad/algorithm-cgal';
import { taggedGraph } from '../tagged/taggedGraph.js';

export const fromTriangles = ({ tags, matrix }, triangles) =>
  taggedGraph(
    { tags, matrix },
    fromSurfaceMesh(fromPolygonsToSurfaceMesh(triangles))
  );
