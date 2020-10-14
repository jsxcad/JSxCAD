import { fromPointsToAlphaShapeAsSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { fromSurfaceMesh } from './fromSurfaceMesh.js';

export const alphaShape = (points, componentLimit) =>
  fromSurfaceMesh(fromPointsToAlphaShapeAsSurfaceMesh(points, componentLimit));
