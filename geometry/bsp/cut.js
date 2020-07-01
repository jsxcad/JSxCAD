import {
  alignVertices,
  toPolygons as toPolygonsFromSolid,
  fromPolygons as toSolidFromPolygons,
} from '@jsxcad/geometry-solid';

import {
  removeExteriorPolygonsForCutDroppingOverlap,
  removeExteriorPolygonsForCutKeepingOverlap,
  fromPolygons as toBspFromPolygons,
} from './bsp.js';

import { createNormalize3 } from '@jsxcad/algorithm-quantize';

export const cut = (solid, surface, normalize = createNormalize3()) => {
  // Build a classifier from the planar polygon.
  const cutBsp = toBspFromPolygons(surface, normalize);
  const solidPolygons = toPolygonsFromSolid(alignVertices(solid, normalize));

  // Classify the solid with it.
  const trimmedSolid = removeExteriorPolygonsForCutDroppingOverlap(
    cutBsp,
    solidPolygons,
    normalize
  );

  // The solid will have holes that need to be patched with the parts of the
  // planar polygon that are on the solid boundary.
  const solidBsp = toBspFromPolygons(solidPolygons, normalize);
  const trimmedPolygons = removeExteriorPolygonsForCutKeepingOverlap(
    solidBsp,
    surface,
    normalize
  );

  return toSolidFromPolygons(
    {},
    [...trimmedSolid, ...trimmedPolygons],
    normalize
  );
};

export const cutOpen = (solid, surface, normalize = createNormalize3()) => {
  // Build a classifier from the planar polygon.
  const cutBsp = toBspFromPolygons(surface, normalize);
  const solidPolygons = toPolygonsFromSolid(alignVertices(solid, normalize));

  // Classify the solid with it.
  const trimmedSolid = removeExteriorPolygonsForCutDroppingOverlap(
    cutBsp,
    solidPolygons,
    normalize
  );

  return toSolidFromPolygons({}, trimmedSolid, normalize);
};
