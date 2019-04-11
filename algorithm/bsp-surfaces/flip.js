import { flip as flipPlane } from '@jsxcad/math-plane';
import { flip as flipSurface } from '@jsxcad/algorithm-surface';

export const flip = (bsp) => {
  // Flip the polygons.
  bsp.surfaces = bsp.surfaces.map(flipSurface);
  // Recompute the plane.
  if (bsp.plane !== undefined) {
    // PROVE: General equivalence.
    // const a = toPlane(bsp.polygons[0]);
    // const b = plane.flip(bsp.plane);
    // if (!plane.equals(a, b)) { throw Error(`die: ${JSON.stringify([a, b])}`); }
    bsp.plane = flipPlane(bsp.plane);
  }
  // Invert the children.
  if (bsp.front !== undefined) {
    flip(bsp.front);
  }
  if (bsp.back !== undefined) {
    flip(bsp.back);
  }
  // Swap the children.
  [bsp.front, bsp.back] = [bsp.back, bsp.front];
};
