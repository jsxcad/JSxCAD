import { generatePackingEnvelopeForSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { taggedPolygonsWithHoles } from '../tagged/taggedPolygonsWithHoles.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const generatePackingEnvelope = (
  geometry,
  offset,
  segments,
  costThreshold
) =>
  taggedPolygonsWithHoles(
    {},
    generatePackingEnvelopeForSurfaceMesh(
      toSurfaceMesh(geometry.graph),
      geometry.matrix,
      offset,
      segments,
      costThreshold
    )
  );
