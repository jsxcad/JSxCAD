import { outlineSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const eachEdge = (geometry, emit) =>
  outlineSurfaceMesh(toSurfaceMesh(geometry.graph), geometry.matrix, emit);
