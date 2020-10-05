import { fromNefPolyhedronToSurfaceMesh } from './fromNefPolyhedronToSurfaceMesh.js';
import { fromSurfaceMeshToGraph } from './fromSurfaceMeshToGraph.js';

export const fromNefPolyhedronToGraph = (nefPolyhedron) =>
  fromSurfaceMeshToGraph(fromNefPolyhedronToSurfaceMesh(nefPolyhedron));
