import { fromPolygonsToSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { taggedGraph } from '../tagged/taggedGraph.js';

export const fromPolygons = ({ tags }, polygons) =>
  taggedGraph(
    { tags },
    fromSurfaceMeshLazy(fromPolygonsToSurfaceMesh(polygons))
  );
