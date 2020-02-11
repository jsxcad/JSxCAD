import { removeExteriorPolygons, removeExteriorPolygonsKeepingSkin, fromPolygons as toBspFromPolygons } from './bsp';
import { toPolygons as toPolygonsFromSolid, fromPolygons as toSolidFromPolygons } from '@jsxcad/geometry-solid';

import { createNormalize3 } from '@jsxcad/algorithm-quantize';

export const cut = (solid, surface, normalize = createNormalize3()) => {
  // Build a classifier from the planar polygon.
  const cutBsp = toBspFromPolygons(surface, normalize);
  const solidPolygons = toPolygonsFromSolid({}, solid);

  // Classify the solid with it.
  const trimmedSolid = removeExteriorPolygons(cutBsp, solidPolygons, normalize);

  // The solid will have holes that need to be patched with the parts of the
  // planar polygon that are on the solid boundary.
  const solidBsp = toBspFromPolygons(solidPolygons, normalize);
  const trimmedPolygons = removeExteriorPolygonsKeepingSkin(solidBsp, surface, normalize);

  return toSolidFromPolygons({}, [...trimmedSolid, ...trimmedPolygons]);
};

export const cutOpen = (solid, surface, normalize = createNormalize3()) => {
  // Build a classifier from the planar polygon.
  const cutBsp = toBspFromPolygons(surface, normalize);
  const solidPolygons = toPolygonsFromSolid({}, solid);

  // Classify the solid with it.
  const trimmedSolid = removeExteriorPolygons(cutBsp, solidPolygons, normalize);

  return toSolidFromPolygons({}, trimmedSolid);
};
