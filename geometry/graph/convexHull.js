import {
  fromPointsToConvexHullAsSurfaceMesh,
  fromSurfaceMesh,
} from '@jsxcad/algorithm-cgal';
import { taggedGraph } from '../tagged/taggedGraph.js';

export const convexHull = ({ tags }, points) =>
  taggedGraph(
    { tags },
    fromSurfaceMesh(fromPointsToConvexHullAsSurfaceMesh(points))
  );
