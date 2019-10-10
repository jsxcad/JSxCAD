import { doesNotOverlap, toPolygons as toPolygonsFromSolid, fromPolygons as toSolidFromPolygons } from '@jsxcad/geometry-solid';
import { removeInteriorPolygons, removeInteriorPolygonsAndSkin, fromSolid as toBspFromSolid } from './bsp';

// An n-way merge, potentially producing duplicate coplanars.
export const unionNway = (...solids) => {
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

// An asymmetric binary merge.
export const union = (...solids) => {
  if (solids.length === 0) {
    return [];
  }
  while (solids.length > 1) {
    const a = solids.shift();
    const aPolygons = toPolygonsFromSolid({}, a);
    const aBsp = toBspFromSolid(a);

    const b = solids.shift();
    const bPolygons = toPolygonsFromSolid({}, b);
    const bBsp = toBspFromSolid(b);

    const aTrimmed = removeInteriorPolygons(bBsp, aPolygons);
    const bTrimmed = removeInteriorPolygonsAndSkin(aBsp, bPolygons);

    solids.push(toSolidFromPolygons({}, [...aTrimmed, ...bTrimmed]));
  }
  return solids[0];
};
