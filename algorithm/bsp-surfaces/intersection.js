import { doesNotOverlap, toPolygons as toPolygonsFromSolid, fromPolygons as toSolidFromPolygons } from '@jsxcad/geometry-solid';
import { removeExteriorPolygons, fromSolid as toBspFromSolid } from './bsp';

export const intersection = (...solids) => {
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
