import { fromNefPolyhedronToSurfaceMesh } from './fromNefPolyhedronToSurfaceMesh.js';
import { fromSurfaceMeshToGraph } from './fromSurfaceMeshToGraph.js';

export const fromNefPolyhedronToGraph = (nefPolyhedron) => {
  throw Error('die');
  return fromSurfaceMeshToGraph(fromNefPolyhedronToSurfaceMesh(nefPolyhedron));
};
