import { fromSurface, toSurface } from "./convert";

import ClipperLib from "clipper-lib";
import { createNormalize2 } from "@jsxcad/algorithm-quantize";
import { doesNotOverlapOrAbut } from "./doesNotOverlap";

const { Clipper, ClipType, PolyType } = ClipperLib;

/**
 * Produces a surface that is the intersection of all provided surfaces.
 * The union of no surfaces is the empty surface.
 * The union of one surface is that surface.
 * @param {Array<Z0Surface>} surfaces - the z0 surfaces to union.
 * @returns {Z0Surface} the resulting z0 surface.
 */
export const intersection = (a, ...z0Surfaces) => {
  if (a === undefined || a.length === 0) {
    return [];
  }
  const normalize = createNormalize2();
  while (z0Surfaces.length >= 1) {
    const b = z0Surfaces.shift();
    if (doesNotOverlapOrAbut(a, b)) {
      return [];
    } else {
      const clipper = new Clipper();
      clipper.AddPaths(fromSurface(a, normalize), PolyType.ptSubject, true);
      clipper.AddPaths(fromSurface(b, normalize), PolyType.ptClip, true);
      a = toSurface(clipper, ClipType.ctIntersection, normalize);
    }
  }
  return a;
};
