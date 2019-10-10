import { doesNotOverlap, toPolygons as toPolygonsFromSolid, fromPolygons as toSolidFromPolygons } from '@jsxcad/geometry-solid';
import { removeExteriorPolygons, removeExteriorPolygonsKeepingSkin, fromSolid as toBspFromSolid } from './bsp';

export const intersectionNway = (...solids) => {
  if (solids.length === 0) {
    return [];
  }
  if (solids.length === 1) {
    return solids[0];
  }
  for (let start = 0; start + 1 < solids.length; start++) {
    for (let end = start + 1; end < solids.length; end++) {
      if (doesNotOverlap(solids[start], solids[end])) {
        return [];
      }
    }
  }
  const bsps = solids.map(solid => toBspFromSolid(solid));
  const polygons = solids.map(solid => toPolygonsFromSolid({}, solid));
  for (let nth = 0; nth < solids.length; nth++) {
    for (const bsp of bsps) {
      // Polygons which fall OUT are removed.
      // Coplanars must fall IN-ward.
      polygons[nth] = removeExteriorPolygons(bsp, polygons[nth]);
    }
  }
  return toSolidFromPolygons({}, [].concat(...polygons));
};

// An asymmetric binary merge.
export const intersection = (...solids) => {
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

    const aTrimmed = removeExteriorPolygonsKeepingSkin(bBsp, aPolygons);
    const bTrimmed = removeExteriorPolygons(aBsp, bPolygons);

    solids.push(toSolidFromPolygons({}, [...aTrimmed, ...bTrimmed]));
  }
  return solids[0];
};
