import { splitPolygon } from './splitPolygon';

export const clipPolygons = (bsp, polygons) => {
  if (polygons.length === 0) {
    // PROVE: Does this happen due to degeneracy?
    return [];
  }
  if (bsp.plane === undefined) {
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
    // These polygons are behind a face, and inside the tree.
    back = [];
  }
  return front.concat(back);
};
