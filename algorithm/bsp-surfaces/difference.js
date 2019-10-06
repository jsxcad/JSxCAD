import { doesNotOverlap, flip, toPolygons as toPolygonsFromSolid, fromPolygons as toSolidFromPolygons } from '@jsxcad/geometry-solid';
import { removeExteriorPolygons, removeInteriorPolygonsAndSkin, fromSolid as toBspFromSolid } from './bsp';

const mayOverlap = (a, b) => !doesNotOverlap(a, b);

export const difference = (aSolid, ...bSolids) => {
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
    aPolygons = removeInteriorPolygonsAndSkin(bBsp[i], aPolygons);
  }
  const aBsp = toBspFromSolid(aSolid);
  const polygons = [];
  for (let i = 0; i < bSolids.length; i++) {
    const bSolid = bSolids[i];
    let bPolygons = toPolygonsFromSolid({}, flip(bSolid));
    bPolygons = removeExteriorPolygons(aBsp, bPolygons);
    for (let j = 0; j < bSolids.length; j++) {
      if (j !== i) {
        bPolygons = removeInteriorPolygonsAndSkin(bBsp[j], bPolygons);
      }
    }
    polygons.push(...bPolygons);
  }
  polygons.push(...aPolygons);
  return toSolidFromPolygons({}, polygons);
};
