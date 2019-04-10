import { flip as flipOfPlane } from '@jsxcad/math-plane';
import { flip as flipOfPoly3 } from '@jsxcad/math-poly3';

export const invert = (bsp) => {
  // Flip the polygons.
  bsp.polygons = bsp.polygons.map(flipOfPoly3);
  // Recompute the plane.
  if (bsp.plane !== undefined) {
    // PROVE: General equivalence.
    // const a = toPlane(bsp.polygons[0]);
    // const b = plane.flip(bsp.plane);
    // if (!plane.equals(a, b)) { throw Error(`die: ${JSON.stringify([a, b])}`); }
    bsp.plane = flipOfPlane(bsp.plane);
  }
  // Invert the children.
  if (bsp.front !== undefined) {
    invert(bsp.front);
  }
  if (bsp.back !== undefined) {
    invert(bsp.back);
  }
  // Swap the children.
  [bsp.front, bsp.back] = [bsp.back, bsp.front];
};
