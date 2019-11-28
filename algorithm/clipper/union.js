import { fromSurface, toSurface } from './convert';

import ClipperLib from 'clipper-lib-fpoint';
import { doesNotOverlapOrAbut } from './doesNotOverlap';

const { Clipper, ClipType, PolyFillType, PolyType } = ClipperLib;

/**
 * Produces a surface that is the union of all provided surfaces.
 * The union of no surfaces is the empty surface.
 * The union of one surface is that surface.
 * @param {Array<Z0Surface>} surfaces - the z0 surfaces to union.
 * @returns {Z0Surface} the resulting z0 surface.
 */
export const union = (...z0Surfaces) => {
  if (z0Surfaces.length === 0) {
    return [];
  }
  while (z0Surfaces.length >= 2) {
    const a = z0Surfaces.shift();
    const b = z0Surfaces.shift();
    if (doesNotOverlapOrAbut(a, b)) {
      z0Surfaces.push([].concat(a, b));
    } else {
      const clipper = new Clipper();
      clipper.AddPaths(fromSurface(a), PolyType.ptSubject, true);
      clipper.AddPaths(fromSurface(b), PolyType.ptClip, true);
      const result = [];
      clipper.Execute(ClipType.ctUnion, result, PolyFillType.pftNonZero, PolyFillType.pftNonZero);
      z0Surfaces.push(toSurface(result));
    }
  }
  return z0Surfaces[0];
};
