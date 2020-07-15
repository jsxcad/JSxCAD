import { inLeaf, outLeaf } from './bsp.js';

import splitPolygon from './splitPolygon.js';

// All planes are faces.

export const clipPolygonsToFaces = (bsp, polygons, normalize, emit) => {
  console.log(`QQ/polygons: ${JSON.stringify(polygons)}`);
  if (polygons.length === 0) {
    return;
  } else if (bsp === inLeaf) {
    for (const polygon of polygons) {
      emit(polygon);
    }
  } else if (bsp !== outLeaf) {
    const front = [];
    const back = [];
    for (const polygon of polygons) {
      splitPolygon(normalize, bsp.plane, polygon, /*back=*/back, /*abutting=*/front, /*overlapping=*/back, /*front=*/front);
    }
    clipPolygonsToFaces(bsp.front, front, normalize, emit);
    clipPolygonsToFaces(bsp.back, back, normalize, emit);
  }
};

export default clipPolygonsToFaces;
