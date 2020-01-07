import {
  alignVertices,
  createNormalize3,
  doesNotOverlap,
  toPolygons as toPolygonsFromSolid,
  fromPolygons as toSolidFromPolygons
} from '@jsxcad/geometry-solid';

import {
  removeInteriorPolygonsKeepingSkin,
  fromSolid as toBspFromSolid
} from './bsp';

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
      polygonSets[a] = removeInteriorPolygonsKeepingSkin(bsps[b], polygonSets[a]);
    }
  }
  return toSolidFromPolygons({}, [].concat(...polygonSets));
};

// An asymmetric binary merge.
export const union = (...solids) => {
  if (solids.length === 0) {
    return [];
  }
  const normalize = createNormalize3();
  while (solids.length > 1) {
    const a = alignVertices(solids.shift(), normalize);
    const aPolygons = toPolygonsFromSolid({}, a);
    const aBsp = toBspFromSolid(a);

    const b = alignVertices(solids.shift(), normalize);
    const bPolygons = toPolygonsFromSolid({}, b);
    const bBsp = toBspFromSolid(b);

    const aTrimmed = removeInteriorPolygonsKeepingSkin(bBsp, aPolygons);
    const bTrimmed = removeInteriorPolygonsKeepingSkin(aBsp, bPolygons);

    solids.push(toSolidFromPolygons({}, [...aTrimmed, ...bTrimmed]));
  }
  return alignVertices(solids[0], normalize);
};
