import { fromPolygonsToSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { fromSurfaceMesh } from './fromSurfaceMesh.js';

export const fromSurface = (surface) =>
  fromSurfaceMesh(fromPolygonsToSurfaceMesh(surface));
