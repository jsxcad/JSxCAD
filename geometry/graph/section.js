import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { sectionOfSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const section = (graph, plane) => {
  for (const planarMesh of sectionOfSurfaceMesh(toSurfaceMesh(graph), [
    plane,
  ])) {
    return fromSurfaceMeshLazy(planarMesh);
  }
};

export const sections = (graph, planes) => {
  console.log(`QQ/section/planes: ${JSON.stringify(planes)}`);
  const graphs = [];
  for (const planarMesh of sectionOfSurfaceMesh(toSurfaceMesh(graph), planes)) {
    graphs.push(fromSurfaceMeshLazy(planarMesh));
  }
  return graphs;
};
