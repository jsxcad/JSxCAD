import { inLeaf, outLeaf } from './bsp';

import { splitPolygon } from './splitPolygon';

// Remove from surfaces those parts that are inside the solid delineated by bsp.
export const removeInteriorPolygons = (bsp, polygons, removeSurfacePolygons = false) => {
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
                   /* coplanarBack= */back,
                   /* coplanarFront= */removeSurfacePolygons ? back : front,
                   /* front= */front);
    }
    const trimmedFront = removeInteriorPolygons(bsp.front, front, removeSurfacePolygons);
    const trimmedBack = removeInteriorPolygons(bsp.back, back, removeSurfacePolygons);

    if (trimmedFront.length === 0) {
      return trimmedBack;
    } else if (trimmedBack.length === 0) {
      return trimmedFront;
    } else {
      return [].concat(trimmedFront, trimmedBack);
    }
  }
};
