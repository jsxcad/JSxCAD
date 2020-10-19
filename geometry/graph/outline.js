import { fromSurfaceMesh } from './fromSurfaceMesh.js';
import { outlineOfSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const outline = (graph) =>
  fromSurfaceMesh(outlineOfSurfaceMesh(toSurfaceMesh(graph)));
