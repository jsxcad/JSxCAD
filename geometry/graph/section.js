import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { sectionOfSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const section = (graph, plane) => {
  for (const planarMesh of sectionOfSurfaceMesh(toSurfaceMesh(graph), [
    plane,
    /* profile= */ false,
  ])) {
    return fromSurfaceMeshLazy(planarMesh);
  }
};

export const sections = (graph, planes, { profile = false } = {}) => {
  const graphs = [];
  for (const planarMesh of sectionOfSurfaceMesh(
    toSurfaceMesh(graph),
    planes,
    /* profile= */ profile
  )) {
    graphs.push(fromSurfaceMeshLazy(planarMesh));
  }
  return graphs;
};
