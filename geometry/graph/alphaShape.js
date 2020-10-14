import { fromPointsToAlphaShapeAsSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { fromSurfaceMesh } from './fromSurfaceMesh.js';

export const alphaShape = (points) =>
  fromSurfaceMesh(fromPointsToAlphaShapeAsSurfaceMesh(points));
