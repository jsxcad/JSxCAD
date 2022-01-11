import {
  smoothShapeOfSurfaceMesh,
  smoothSurfaceMesh,
  subdivideSurfaceMesh,
} from '@jsxcad/algorithm-cgal';

import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { getNonVoidGraphs } from '../tagged/getNonVoidGraphs.js';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toConcreteGeometry } from './../tagged/toConcreteGeometry.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const smooth = (geometry, options = {}, selections = []) => {
  const { method = 'SmoothShape' } = options;
  const selectionGraphs = selections.flatMap((selection) =>
    getNonVoidGraphs(toConcreteGeometry(selection))
  );
  switch (method) {
    case 'mesh': {
      if (selectionGraphs.length === 0) {
        throw Error('No selections provided for SmoothMesh');
      }
      return taggedGraph(
        { tags: geometry.tags, matrix: geometry.matrix },
        fromSurfaceMeshLazy(
          smoothSurfaceMesh(
            toSurfaceMesh(geometry.graph),
            geometry.matrix,
            options,
            selectionGraphs.map(({ graph, matrix }) => ({
              mesh: toSurfaceMesh(graph),
              matrix,
            }))
          )
        )
      );
    }
    case 'shape': {
      return taggedGraph(
        { tags: geometry.tags, matrix: geometry.matrix },
        fromSurfaceMeshLazy(
          smoothShapeOfSurfaceMesh(
            toSurfaceMesh(geometry.graph),
            geometry.matrix,
            options,
            selectionGraphs.map(({ graph, matrix }) => ({
              mesh: toSurfaceMesh(graph),
              matrix,
            }))
          )
        )
      );
    }
    case 'subdivide': {
      return taggedGraph(
        { tags: geometry.tags },
        fromSurfaceMeshLazy(
          subdivideSurfaceMesh(toSurfaceMesh(geometry.graph), options)
        )
      );
    }
    default:
      throw Error(`Unknown method ${method}`);
  }
};
