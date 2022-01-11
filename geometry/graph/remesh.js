import {
  isotropicRemeshingOfSurfaceMesh,
  remeshSurfaceMesh,
} from '@jsxcad/algorithm-cgal';

import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { getNonVoidGraphs } from '../tagged/getNonVoidGraphs.js';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toConcreteGeometry } from './../tagged/toConcreteGeometry.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const remesh = (geometry, options = {}, selections = []) => {
  const { method = 'edgeLength', lengths = [1] } = options;
  const selectionGraphs = selections.flatMap((selection) =>
    getNonVoidGraphs(toConcreteGeometry(selection))
  );
  switch (method) {
    case 'isotropic': {
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
    case 'edgeLength':
      return taggedGraph(
        { tags: geometry.tags, matrix: geometry.matrix },
        fromSurfaceMeshLazy(
          remeshSurfaceMesh(
            toSurfaceMesh(geometry.graph),
            geometry.matrix,
            ...lengths
          )
        )
      );
    default:
      throw Error(`Unknown remesh method ${method}`);
  }
};
