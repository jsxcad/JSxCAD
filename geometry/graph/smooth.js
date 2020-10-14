import { fromSurfaceMesh } from './fromSurfaceMesh.js';
import { smoothSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const smooth = (graph) =>
  fromSurfaceMesh(smoothSurfaceMesh(toSurfaceMesh(graph)));
