import { doesNotOverlap, toPolygons as toPolygonsFromSolid, fromPolygons as toSolidFromPolygons } from '@jsxcad/geometry-solid';
import { removeInteriorPolygons, fromSolid as toBspFromSolid } from './bsp';

export const union = (...solids) => {
  if (solids.length === 0) {
    return [];
  }
  const bsps = [];
  const polygonSets = [];
  for (let a = 0; a < solids.length; a++) {
    for (let b = 0; b < solids.length; b++) {
      if (a === b) {
        // No self-interaction.
        continue;
      }
      if (polygonSets[a] === undefined) {
        polygonSets[a] = toPolygonsFromSolid({}, solids[a]);
      }
      if (doesNotOverlap(solids[a], solids[b])) {
        // No overlap.
        continue;
      }
      // Remove polygons interior to other shapes.
      if (bsps[b] === undefined) {
        bsps[b] = toBspFromSolid(solids[b]);
      }
      polygonSets[a] = removeInteriorPolygons(bsps[b], polygonSets[a]);
    }
  }
  return toSolidFromPolygons({}, [].concat(...polygonSets));
};
