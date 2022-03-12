import {
  fromSurfaceMesh,
  smoothShapeOfSurfaceMesh,
  smoothSurfaceMesh,
  subdivideSurfaceMesh,
} from '@jsxcad/algorithm-cgal';

import { getNonVoidGraphs } from '../tagged/getNonVoidGraphs.js';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toConcreteGeometry } from './../tagged/toConcreteGeometry.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const smooth = (geometry, options = {}, selections = []) => {
  const { method = 'shape' } = options;
  const selectionGraphs = selections.flatMap((selection) =>
    getNonVoidGraphs(toConcreteGeometry(selection))
  );
  switch (method) {
    case 'mesh': {
      return taggedGraph(
        { tags: geometry.tags, matrix: geometry.matrix },
        fromSurfaceMesh(
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
        fromSurfaceMesh(
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
        fromSurfaceMesh(
          subdivideSurfaceMesh(toSurfaceMesh(geometry.graph), options)
        )
      );
    }
    default:
      throw Error(`Unknown method ${method}`);
  }
};
