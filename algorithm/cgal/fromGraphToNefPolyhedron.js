import { fromGraphToSurfaceMesh } from './fromGraphToSurfaceMesh.js';
import { fromSurfaceMeshToNefPolyhedron } from './fromSurfaceMeshToNefPolyhedron.js';

export const fromGraphToNefPolyhedron = (graph) =>
  fromSurfaceMeshToNefPolyhedron(fromGraphToSurfaceMesh(graph));
