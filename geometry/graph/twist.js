import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';
import { twistSurfaceMesh } from '@jsxcad/algorithm-cgal';

export const twist = (graph, degreesPerZ) =>
  fromSurfaceMeshLazy(twistSurfaceMesh(toSurfaceMesh(graph), degreesPerZ));
