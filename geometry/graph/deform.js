import { deformSurfaceMesh, fromSurfaceMesh } from '@jsxcad/algorithm-cgal';

import { getNonVoidGraphs } from '../tagged/getNonVoidGraphs.js';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toConcreteGeometry } from './../tagged/toConcreteGeometry.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const deform = (geometry, entries, iterations, tolerance, alpha) => {
  const flattened = [];
  for (const { selection, deformation } of entries) {
    for (const geometry of getNonVoidGraphs(toConcreteGeometry(selection))) {
      flattened.push({
        mesh: toSurfaceMesh(geometry.graph),
        matrix: geometry.matrix,
        deformation,
      });
    }
  }
  return taggedGraph(
    { tags: geometry.tags, matrix: geometry.matrix },
    fromSurfaceMesh(
      deformSurfaceMesh(
        toSurfaceMesh(geometry.graph),
        geometry.matrix,
        flattened,
        iterations,
        tolerance,
        alpha
      )
    )
  );
};
