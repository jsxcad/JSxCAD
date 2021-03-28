import { extrudeSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const extrude = (graph, height, depth) =>
  fromSurfaceMeshLazy(extrudeSurfaceMesh(toSurfaceMesh(graph), height, depth));
