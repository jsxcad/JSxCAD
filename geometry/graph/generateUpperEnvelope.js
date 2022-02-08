import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { generateUpperEnvelopeForSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const generateUpperEnvelope = (geometry) =>
  taggedGraph(
    {},
    fromSurfaceMeshLazy(
      generateUpperEnvelopeForSurfaceMesh(
        toSurfaceMesh(geometry.graph),
        geometry.matrix
      )
    )
  );
