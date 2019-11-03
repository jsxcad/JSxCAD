import { doesNotOverlap, flip, toPolygons as toPolygonsFromSolid, fromPolygons as toSolidFromPolygons } from '@jsxcad/geometry-solid';
import { removeExteriorPolygonsAndSkin, removeInteriorPolygonsAndSkin, fromSolid as toBspFromSolid } from './bsp';

/*
const mayOverlap = (a, b) => !doesNotOverlap(a, b);

export const differenceNway = (aSolid, ...bSolids) => {
  if (aSolid === undefined) {
    return [];
  }
  bSolids = bSolids.filter(bSolid => mayOverlap(aSolid, bSolid));
  if (bSolids.length === 0) {
    return aSolid;
  }
  let aPolygons = toPolygonsFromSolid({}, aSolid);
  const bBsp = [];
  for (let i = 0; i < bSolids.length; i++) {
    const bSolid = bSolids[i];
    bBsp[i] = toBspFromSolid(bSolid);
    aPolygons = removeInteriorPolygonsKeepingSkin(bBsp[i], aPolygons);
  }
  const aBsp = toBspFromSolid(aSolid);
  const polygons = [];
  for (let i = 0; i < bSolids.length; i++) {
    const bSolid = bSolids[i];
    let bPolygons = toPolygonsFromSolid({}, flip(bSolid));
    bPolygons = removeExteriorPolygons(aBsp, bPolygons);
    for (let j = 0; j < bSolids.length; j++) {
      if (j !== i) {
        bPolygons = removeInteriorPolygonsKeepingSkin(bBsp[j], bPolygons);
      }
    }
    polygons.push(...bPolygons);
  }
  polygons.push(...aPolygons);
  return toSolidFromPolygons({}, polygons);
};
*/

export const difference = (aSolid, ...bSolids) => {
  while (bSolids.length > 0) {
    const a = aSolid;
    const b = bSolids.shift();

    if (doesNotOverlap(a, b)) {
      continue;
    }

    const aPolygons = toPolygonsFromSolid({}, a);
    const aBsp = toBspFromSolid(a);

    const bPolygons = toPolygonsFromSolid({}, flip(b));
    const bBsp = toBspFromSolid(b);

    const aTrimmed = removeInteriorPolygonsAndSkin(bBsp, aPolygons);
    const bTrimmed = removeExteriorPolygonsAndSkin(aBsp, bPolygons);

    aSolid = toSolidFromPolygons({}, [...aTrimmed, ...bTrimmed]);
  }
  return aSolid;
};
