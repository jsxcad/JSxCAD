import { ClipType, PolyFillType, clipper } from './clipper-lib';
import { fromPaths, fromSurfaceAsClosedPaths, toPaths } from './convert';

import { createNormalize2 } from '@jsxcad/algorithm-quantize';
import { doesNotOverlapOrAbut } from './doesNotOverlap';

/**
 * Produces a surface that is the intersection of all provided surfaces.
 * The union of no surfaces is the empty surface.
 * The union of one surface is that surface.
 * @param {Array<Z0Surface>} surfaces - the z0 surfaces to union.
 * @returns {Z0Surface} the resulting z0 surface.
 */
export const intersectionOfPathsBySurfaces = (a, ...z0Surfaces) => {
  if (a === undefined || a.length === 0 || z0Surfaces.length === 0) {
    return [];
  }
  const normalize = createNormalize2();
  while (z0Surfaces.length >= 1) {
    const b = z0Surfaces.shift();
    if (doesNotOverlapOrAbut(a, b)) {
      return [];
    } else {
      const subjectInputs = fromPaths(a, normalize);
      if (subjectInputs.length === 0) {
        return [];
      }
      const clipInputs = fromSurfaceAsClosedPaths(b, normalize);
      if (clipInputs.length === 0) {
        return [];
      }
      const result = clipper.clipToPolyTree({
        clipType: ClipType.Intersection,
        subjectInputs,
        clipInputs,
        subjectFillType: PolyFillType.Positive,
      });
      a = toPaths(clipper, result, normalize);
    }
  }
  return a;
};
