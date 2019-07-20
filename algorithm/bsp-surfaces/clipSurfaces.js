import { splitSurface } from './splitSurface';

export const clipSurfaces = (bsp, surfaces) => {
  if (surfaces.length === 0) {
    // PROVE: Does this happen due to degeneracy?
    return [];
  }
  if (bsp.plane === undefined) {
    return surfaces.slice();
  }
  let front = [];
  let back = [];
  for (let i = 0; i < surfaces.length; i++) {
    splitSurface(bsp.plane, front, back, front, back, surfaces[i]);
  }
  if (bsp.front !== undefined) {
    front = clipSurfaces(bsp.front, front);
  }
  if (bsp.back !== undefined) {
    back = clipSurfaces(bsp.back, back);
  } else {
    // PROVE: Explain this asymmetry.
    // These surfaces are behind a face, and inside the tree.
    back = [];
  }
  return front.concat(back);
};
