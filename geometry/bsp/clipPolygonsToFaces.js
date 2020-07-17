import { inLeaf, outLeaf } from './bsp.js';

import splitPolygon from './splitPolygon.js';

// All planes are faces.

export const clipPolygonsToFaces = (
  bsp,
  polygons,
  normalize,
  emit,
  path = ''
) => {
  if (polygons.length === 0) {
  } else if (bsp === inLeaf) {
    for (const polygon of polygons) {
      console.log(`QQ/path: ${path}`);
      polygon.path = path;
      emit(polygon);
    }
  } else if (bsp !== outLeaf) {
    const front = [];
    const back = [];
    for (const polygon of polygons) {
      splitPolygon(
        normalize,
        bsp.plane,
        polygon,
        /* back= */ back,
        /* abutting= */ front,
        /* overlapping= */ back,
        /* front= */ front
      );
    }
    clipPolygonsToFaces(bsp.front, front, normalize, emit, path + 'f');
    clipPolygonsToFaces(bsp.back, back, normalize, emit, path + 'b');
  }
};

export default clipPolygonsToFaces;
