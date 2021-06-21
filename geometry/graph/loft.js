import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { loftBetweenCongruentSurfaceMeshes } from '@jsxcad/algorithm-cgal';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const loft = (closed, ...geometries) =>
  taggedGraph(
    { tags: geometries[0].tags },
    fromSurfaceMeshLazy(
      loftBetweenCongruentSurfaceMeshes(
        closed,
        ...geometries.map((geometry) => [
          toSurfaceMesh(geometry.graph),
          geometry.matrix,
        ])
      )
    )
  );
