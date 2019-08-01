import { doesNotOverlap, flip, makeSurfacesConvex, toPolygons as toPolygonsFromSolid, fromPolygons as toSolidFromPolygons } from '@jsxcad/geometry-solid';
import { inLeaf, outLeaf, fromPolygons as toBspFromPolygons, fromSolid as toBspFromSolid } from './bsp';

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
                   /* coplanarBack= */front,
                   /* coplanarFront= */back,
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

export const removeInteriorPolygons = (bsp, polygons) => {
  if (bsp === inLeaf) {
    return [];
  } else if (bsp === outLeaf) {
    return polygons;
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
    const trimmedFront = removeInteriorPolygons(bsp.front, front);
    const trimmedBack = removeInteriorPolygons(bsp.back, back);

    if (trimmedFront.length === 0) {
      return trimmedBack;
    } else if (trimmedBack.length === 0) {
      return trimmedFront;
    } else {
      return [].concat(trimmedFront, trimmedBack);
    }
  }
};

export const difference = (aSolid, ...bSolids) => {
  if (aSolid === undefined) {
    return [];
  }
  if (bSolids.length === 0) {
    return aSolid;
  }
  let polygons;
  let aPolygons;
  let aBsp;
  const bBsp = [];
  for (let i = 0; i < bSolids.length; i++) {
    const bSolid = bSolids[i];
    if (doesNotOverlap(aSolid, bSolid)) {
      continue;
    }
    let bPolygons = toPolygonsFromSolid({}, flip(bSolid));
    if (aPolygons === undefined) {
      aPolygons = toPolygonsFromSolid({}, makeSurfacesConvex({}, aSolid));
    }
    if (aBsp === undefined) {
      aBsp = toBspFromPolygons(aPolygons);
    }
    if (bBsp[i] === undefined) {
      bBsp[i] = toBspFromSolid(bSolid);
    }
    aPolygons = removeInteriorPolygons(bBsp[i], aPolygons);
    bPolygons = removeExteriorPolygons(aBsp, bPolygons);
    for (let j = 0; j < bSolids.length; j++) {
      if (j === i || doesNotOverlap(bSolid[i], bSolid[j])) {
        continue;
      }
      if (bBsp[j] === undefined) {
        bBsp[j] = toBspFromSolid(bSolid);
      }
      bPolygons = removeInteriorPolygons(bBsp[j], bPolygons);
    }
    if (polygons === undefined) {
      polygons = [];
    }
    polygons.push(...bPolygons);
  }
  if (polygons === undefined) {
    return aSolid;
  } else {
    polygons.push(...aPolygons);
    return toSolidFromPolygons({}, polygons);
  }
};
