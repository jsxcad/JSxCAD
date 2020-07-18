import { inLeaf, outLeaf } from './bsp.js';

import splitPolygon from './splitPolygon.js';

export const intersectSurface = (bsp, surface, normalize, emit) => {
  if (bsp === inLeaf) {
    return emit(surface);
  } else if (bsp === outLeaf) {
  } else {
    const front = [];
    const back = [];
    for (let i = 0; i < surface.length; i++) {
      splitPolygon(
        normalize,
        bsp.plane,
        surface[i],
        /* back= */ back,
        /* abutting= */ back,
        /* overlapping= */ back,
        /* front= */ front
      );
    }
    intersectSurface(bsp.front, front, normalize, emit);
    intersectSurface(bsp.back, back, normalize, emit);
  }
};

export default intersectSurface;
