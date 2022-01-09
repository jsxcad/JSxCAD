import {
  isotropicRemeshingOfSurfaceMesh,
  remeshSurfaceMesh,
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
  const { method = 'Remesh' } = options;
  const selectionGraphs = selections.flatMap((selection) =>
    getNonVoidGraphs(toConcreteGeometry(selection))
  );
  switch (method) {
    case 'Remesh':
      return taggedGraph(
        { tags: geometry.tags, matrix: geometry.matrix },
        fromSurfaceMeshLazy(
          remeshSurfaceMesh(
            toSurfaceMesh(geometry.graph),
            geometry.matrix,
            options
          )
        )
      );
    case 'IsotropicRemeshing': {
      return taggedGraph(
        { tags: geometry.tags, matrix: geometry.matrix },
        fromSurfaceMeshLazy(
          isotropicRemeshingOfSurfaceMesh(
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
    case 'SmoothMesh': {
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
    case 'SmoothShape': {
      if (selectionGraphs.length === 0) {
        throw Error('No selections provided for SmoothShape');
      }
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
    case 'Subdivide': {
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
