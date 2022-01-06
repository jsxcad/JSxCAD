import { eachPointOfSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const eachPoint = (geometry, emit) =>
  eachPointOfSurfaceMesh(toSurfaceMesh(geometry.graph), geometry.matrix, emit);
