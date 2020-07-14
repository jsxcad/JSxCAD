import { inLeaf, outLeaf } from './bsp.js';

import splitPaths from './splitPaths.js';

export const removeExteriorPaths = (bsp, paths, normalize, emit) => {
  if (bsp === inLeaf) {
    return emit(paths);
  } else if (bsp === outLeaf) {
    return [];
  } else {
    const front = [];
    const back = [];
    splitPaths(
      normalize,
      bsp.plane,
      paths,
      /* back= */ back,
      /* abutting= */ front,
      /* coplanar= */ back
    );
    removeExteriorPaths(bsp.front, front, normalize, emit);
    removeExteriorPaths(bsp.back, back, normalize, emit);
  }
};

export default removeExteriorPaths;
