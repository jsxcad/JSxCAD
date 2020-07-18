import { inLeaf, outLeaf } from './bsp.js';

import splitPolygon from './splitPolygon.js';

export const differenceSurface = (bsp, surface, normalize, emit) => {
  if (bsp === outLeaf) {
    emit(surface);
  } else if (bsp !== inLeaf) {
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
    differenceSurface(bsp.front, front, normalize, emit);
    differenceSurface(bsp.back, back, normalize, emit);
  }
};

export default differenceSurface;
