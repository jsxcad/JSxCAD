import {
  fromSurfaceMesh,
  generateUpperEnvelopeForSurfaceMesh,
} from '@jsxcad/algorithm-cgal';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const generateUpperEnvelope = (geometry) =>
  taggedGraph(
    {},
    fromSurfaceMesh(
      generateUpperEnvelopeForSurfaceMesh(
        toSurfaceMesh(geometry.graph),
        geometry.matrix
      )
    )
  );
