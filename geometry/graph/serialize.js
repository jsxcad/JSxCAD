import { serializeSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const serialize = (geometry, options) =>
  serializeSurfaceMesh(toSurfaceMesh(geometry.graph));
