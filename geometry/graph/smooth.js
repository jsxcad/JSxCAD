import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { smoothSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const smooth = (graph) =>
  fromSurfaceMeshLazy(smoothSurfaceMesh(toSurfaceMesh(graph)));
