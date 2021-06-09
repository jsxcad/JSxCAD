import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { sectionOfSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const section = (geometry, plane) => {
  for (const planarMesh of sectionOfSurfaceMesh(
    toSurfaceMesh(geometry.graph),
    geometry.matrix,
    [plane, /* profile= */ false]
  )) {
    return taggedGraph(
      { tags: geometry.tags },
      fromSurfaceMeshLazy(planarMesh)
    );
  }
};

export const sections = (geometry, planes, { profile = false } = {}) => {
  const graphs = [];
  for (const planarMesh of sectionOfSurfaceMesh(
    toSurfaceMesh(geometry.graph),
    geometry.matrix,
    planes,
    /* profile= */ profile
  )) {
    graphs.push(
      taggedGraph({ tags: geometry.tags }, fromSurfaceMeshLazy(planarMesh))
    );
  }
  return graphs;
};
