import { fromPointsToConvexHullAsSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { taggedGraph } from '../tagged/taggedGraph.js';

export const convexHull = ({ tags }, points) =>
  taggedGraph(
    { tags },
    fromSurfaceMeshLazy(fromPointsToConvexHullAsSurfaceMesh(points))
  );
