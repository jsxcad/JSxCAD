import { fromClosedPaths, fromOpenPaths, fromSurface, toPaths } from './convert';

import ClipperLib from 'clipper-lib';
import { createNormalize2 } from '@jsxcad/algorithm-quantize';
import { doesNotOverlapOrAbut } from './doesNotOverlap';

const { Clipper, ClipType, PolyType } = ClipperLib;

/**
 * Produces a surface that is the intersection of all provided surfaces.
 * The union of no surfaces is the empty surface.
 * The union of one surface is that surface.
 * @param {Array<Z0Surface>} surfaces - the z0 surfaces to union.
 * @returns {Z0Surface} the resulting z0 surface.
 */
export const intersectionOfPathsBySurfaces = (a, ...z0Surfaces) => {
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
      const openPaths = fromOpenPaths(a, normalize);
      if (openPaths.length > 0) {
        clipper.AddPaths(openPaths, PolyType.ptSubject, false);
      }
      const closedPaths = fromClosedPaths(a, normalize);
      if (closedPaths.length > 0) {
        clipper.AddPaths(closedPaths, PolyType.ptSubject, true);
      }
      clipper.AddPaths(fromSurface(b, normalize), PolyType.ptClip, true);
      // How do we tell which are open or closed?
      a = toPaths(clipper, ClipType.ctIntersection, normalize);
    }
  }
  return a;
};
