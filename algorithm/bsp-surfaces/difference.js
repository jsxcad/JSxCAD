import { doesNotOverlap, flip, toPolygons as toPolygonsFromSolid, fromPolygons as toSolidFromPolygons } from '@jsxcad/geometry-solid';
import { inLeaf, outLeaf, fromSolid as toBspFromSolid } from './bsp';

import { makeSurfacesConvex } from './makeSurfacesConvex';
import { splitPolygon } from './splitPolygon';

const doesOverlap = (a, b) => !doesNotOverlap(a, b);

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
  bSolids = bSolids.filter(bSolid => doesOverlap(aSolid, bSolid));
  if (bSolids.length === 0) {
    return aSolid;
  }
  aSolid = makeSurfacesConvex(aSolid);
  bSolids = bSolids.map(bSolid => makeSurfacesConvex(bSolid));
  let aPolygons = toPolygonsFromSolid({}, aSolid);
  const bBsp = [];
  for (let i = 0; i < bSolids.length; i++) {
    const bSolid = bSolids[i];
    bBsp[i] = toBspFromSolid(bSolid);
    aPolygons = removeInteriorPolygons(bBsp[i], aPolygons);
  }
  const aBsp = toBspFromSolid(aSolid);
  const polygons = [];
  for (let i = 0; i < bSolids.length; i++) {
    const bSolid = bSolids[i];
    let bPolygons = toPolygonsFromSolid({}, flip(bSolid));
    bPolygons = removeExteriorPolygons(aBsp, bPolygons);
    for (let j = 0; j < bSolids.length; j++) {
      if (j !== i) {
        bPolygons = removeInteriorPolygons(bBsp[j], bPolygons);
      }
    }
    polygons.push(...bPolygons);
  }
  polygons.push(...aPolygons);
  return toSolidFromPolygons({}, polygons);
};
