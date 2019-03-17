import { splitPolygon } from './splitPolygon';

var depth = 0;

export const clipPolygons = (bsp, polygons) => {
  console.log(`QQ/clipPolygons/depth: ${depth += 1}`);
  if (bsp.plane === undefined) {
    throw Error('die');
    // PROVE: Why this is correct, and why it is decided by bsp.plane?
    //   I guess that this means that it is a new leaf in the tree, and so no clipping should happen.

    // We need this slice as the bsp trees perform destructive updates.
    return polygons.slice();
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
    back = [];
  }
  depth -= 1;
  return front.concat(back);
};
