import { fromSurfaceMesh, sectionOfSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const section = (geometry, matrix) => {
  for (const planarMesh of sectionOfSurfaceMesh(
    toSurfaceMesh(geometry.graph),
    geometry.matrix,
    [matrix],
    /* profile= */ false
  )) {
    return taggedGraph({ tags: geometry.tags }, fromSurfaceMesh(planarMesh));
  }
};

export const sections = (geometry, matrices, { profile = false } = {}) => {
  const graphs = [];
  for (const planarMesh of sectionOfSurfaceMesh(
    toSurfaceMesh(geometry.graph),
    geometry.matrix,
    matrices,
    /* profile= */ profile
  )) {
    graphs.push(
      taggedGraph({ tags: geometry.tags }, fromSurfaceMesh(planarMesh))
    );
  }
  return graphs;
};
