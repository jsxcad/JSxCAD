import { doesNotOverlap, toPolygons as toPolygonsFromSolid, fromPolygons as toSolidFromPolygons } from '@jsxcad/geometry-solid';
import { inLeaf, outLeaf, fromSolid as toBspFromSolid } from './bsp';

import { makeSurfacesConvex } from './makeSurfacesConvex';
import { splitPolygon } from './splitPolygon';

// Remove from surfaces those parts that are inside the solid delineated by bsp.
export const removeExteriorPolygons = (bsp, polygons, removeSurfacePolygons = false) => {
  if (bsp === inLeaf) {
    return polygons;
  } else if (bsp === outLeaf) {
    return [];
  } else {
    const front = [];
    const back = [];
    for (let i = 0; i < polygons.length; i++) {
      splitPolygon(bsp.plane,
                   polygons[i],
                   /* back= */back,
                   /* coplanarBack= */front, // was back
                   /* coplanarFront= */back, // was back
                   /* front= */front);
    }
    const trimmedFront = removeExteriorPolygons(bsp.front, front, removeSurfacePolygons);
    const trimmedBack = removeExteriorPolygons(bsp.back, back, removeSurfacePolygons);

    if (trimmedFront.length === 0) {
      return trimmedBack;
    } else if (trimmedBack.length === 0) {
      return trimmedFront;
    } else {
      return [].concat(trimmedFront, trimmedBack);
    }
  }
};

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
  solids = solids.map(solid => makeSurfacesConvex(solid));
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
