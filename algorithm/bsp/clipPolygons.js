import { splitPolygon } from './splitPolygon';

export const clipPolygons = (bsp, polygons) => {
  if (polygons.length === 0) {
    // PROVE: Does this happen due to degeneracy?
    return [];
  }
  if (bsp.plane === undefined) {
    // Why do we never reach this point?
    throw Error('die');
    // PROVE: Why this is correct, and why it is decided by bsp.plane?
    //   I guess that this means that it is a new leaf in the tree, and so no clipping should happen.

    // We need this slice as the bsp trees perform destructive updates.
    // return polygons.slice();
  }
  let front = [];
  let back = [];
  for (let i = 0; i < polygons.length; i++) {
    splitPolygon(bsp.plane, front, back, front, back, polygons[i]);
  }
  if (bsp.front !== undefined) {
    front = clipPolygons(bsp.front, front);
  }
  if (bsp.back !== undefined) {
    back = clipPolygons(bsp.back, back);
  } else {
    // PROVE: Explain this asymmetry.
    // These polygons are behind a face, and inside the tree.
    back = [];
  }
  return front.concat(back);
};
