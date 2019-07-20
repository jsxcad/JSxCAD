import { inLeaf, outLeaf } from './bsp';

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
    const junk = [];
    for (let i = 0; i < polygons.length; i++) {
      splitPolygon(bsp.plane,
                   polygons[i],
                   /* back=*/back,
                   /* coplanarBack=*/back,
                   /* coplanarFront=*/back,
                   /* front=*/front);
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
