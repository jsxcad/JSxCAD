import { ClipType, PolyFillType, clipper } from './clipper-lib';
import { fromSurface, toSurface } from './convert';

import { createNormalize2 } from '@jsxcad/algorithm-quantize';
import { doesNotOverlapOrAbut } from './doesNotOverlap';

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
      const aPolygons = fromSurface(a, normalize);
      if (aPolygons.length === 0) {
        return [];
      }
      const bPolygons = fromSurface(b, normalize);
      if (bPolygons.length === 0) {
        return [];
      }
      const result = clipper.clipToPaths(
        {
          clipType: ClipType.Intersection,
          subjectInputs: [{ data: aPolygons, closed: true }],
          clipInputs: [{ data: bPolygons, closed: true }],
          subjectFillType: PolyFillType.Positive
        });
      a = toSurface(result, normalize);
    }
  }
  return a;
};
