import { fromPointsToConvexHullAsSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { fromSurfaceMesh } from './fromSurfaceMesh.js';

export const convexHull = (points) =>
  fromSurfaceMesh(fromPointsToConvexHullAsSurfaceMesh(points));
