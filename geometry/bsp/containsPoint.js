import { inLeaf, outLeaf } from './bsp.js';

export const containsPoint = (bsp, point, history = []) => {
  while (true) {
    history.push(bsp);
    if (bsp === inLeaf) {
      return true;
    } else if (bsp === outLeaf) {
      return false;
    } else {
      const plane = bsp.plane;
      // const t = planeDistance(plane, point);
      const t =
        plane[0] * point[0] +
        plane[1] * point[1] +
        plane[2] * point[2] -
        plane[3];
      if (t <= 0) {
        // Consider points on the surface to be contained.
        bsp = bsp.back;
      } else {
        bsp = bsp.front;
      }
    }
  }
};
