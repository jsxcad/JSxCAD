import { inLeaf, outLeaf } from './bsp.js';

import splitPolygon from './splitPolygon.js';

export const clipPolygonsToFaces = (bsp, polygons, normalize, emit) => {
  if (bsp !== inLeaf && bsp !== outLeaf) {
    const front = [];
    const back = [];
    const face = [];
    for (let i = 0; i < polygons.length; i++) {
      splitPolygon(
        normalize,
        bsp.plane,
        polygons[i],
        /* back= */ back,
        /* abutting= */ front,
        /* overlapping= */ face,
        /* front= */ front
      );
    }
    if (front.length > 0) {
      clipPolygonsToFaces(bsp.front, front, normalize, emit);
    }
    if (back.length > 0) {
      clipPolygonsToFaces(bsp.back, back, normalize, emit);
    }
    if (face.length > 0) {
      clipFaces(bsp.back, face, normalize, emit);
    }
  }
};

export const clipFaces = (bsp, polygons, normalize, emit) => {
  if (bsp === inLeaf) {
    emit(polygons);
  } else if (bsp !== outLeaf) {
    const front = [];
    const back = [];
    const face = [];
    for (let i = 0; i < polygons.length; i++) {
      splitPolygon(
        normalize,
        bsp.plane,
        polygons[i],
        /* back= */ back,
        /* abutting= */ front,
        /* overlapping= */ face,
        /* front= */ front
      );
    }
    if (front.length > 0) {
      clipPolygonsToFaces(bsp.front, front, normalize, emit);
    }
    if (back.length > 0) {
      clipPolygonsToFaces(bsp.back, back, normalize, emit);
    }
    if (face.length > 0) {
      clipFaces(bsp.back, face, normalize, emit);
    }
  }
};

export default clipPolygonsToFaces;
