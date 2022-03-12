import {
  fromSurfaceMesh,
  projectToPlaneOfSurfaceMesh,
} from '@jsxcad/algorithm-cgal';
import { scale } from '@jsxcad/math-vec3';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const projectToPlane = (geometry, plane, direction) => {
  let { graph } = geometry;
  return taggedGraph(
    {},
    fromSurfaceMesh(
      projectToPlaneOfSurfaceMesh(
        toSurfaceMesh(graph),
        geometry.matrix,
        ...scale(1, direction),
        ...plane
      )
    )
  );
};
