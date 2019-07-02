import { splitSurface } from './splitSurface';

// Remove from surfaces those parts that are inside the solid delineated by bsp.
export const clipSurfaces = (bsp, surfaces) => {
  if (surfaces.length === 0) {
    // Nothing to do.
    return [];
  }
  if (bsp.plane === undefined) {
    // An unclassified region -- how can this be?
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
    // These surfaces are definitely inside the volume delineated by bsp.
    // Discard them.
    back = [];
  }
  return front.concat(back);
};
