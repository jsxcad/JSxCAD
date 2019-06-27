import { cutSurface, flip } from '@jsxcad/geometry-surface';

import { toLoops } from '@jsxcad/geometry-polygons';

export const cut = (plane, solid) => {
  const front = [];
  const back = [];
  const frontEdges = [];
  const backEdges = [];
  for (const surface of solid) {
    cutSurface(plane, front, back, front, back, frontEdges, backEdges, surface);
    if (frontEdges.some(edge => edge[1] === undefined)) {
      throw Error(`die/end/missing: ${JSON.stringify(frontEdges)}`);
    }
  }

  if (frontEdges.length > 0) {
    // FIX: This can produce a solid with separate coplanar surfaces.
    front.push(flip(toLoops({}, frontEdges)));
  }

  if (backEdges.length > 0) {
    // FIX: This can produce a solid with separate coplanar surfaces.
    back.push(flip(toLoops({}, backEdges)));
  }

  return [front, back];
};
