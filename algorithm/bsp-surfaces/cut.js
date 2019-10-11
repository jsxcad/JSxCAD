import { removeExteriorPolygons, fromPolygons as toBspFromPolygons } from './bsp';
import { toPolygons as toPolygonsFromSolid, fromPolygons as toSolidFromPolygons } from '@jsxcad/geometry-solid';

export const cut = (solid, surface) => {
  // Build a classifier from the planar polygon.
  const cutBsp = toBspFromPolygons(surface);
  const solidPolygons = toPolygonsFromSolid({}, solid);

  // Classify the solid with it.
  const trimmedSolid = removeExteriorPolygons(cutBsp, solidPolygons);

  // The solid will have holes that need to be patched with the parts of the
  // planar polygon that are on the solid boundary.
  const solidBsp = toBspFromPolygons(solidPolygons);
  const trimmedPolygons = removeExteriorPolygons(solidBsp, surface);

  return toSolidFromPolygons({}, [...trimmedSolid, ...trimmedPolygons]);
};
