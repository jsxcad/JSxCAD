import { ClipType, PolyFillType, clipper } from './clipper-lib';
import { fromSurface, toSurface } from './convert';

import { createNormalize2 } from '@jsxcad/algorithm-quantize';
import { doesNotOverlapOrAbut } from './doesNotOverlap';

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
  const normalize = createNormalize2();
  while (z0Surfaces.length >= 2) {
    const a = z0Surfaces.shift();
    const b = z0Surfaces.shift();
    if (doesNotOverlapOrAbut(a, b)) {
      z0Surfaces.push([].concat(a, b));
    } else {
      const aPolygons = fromSurface(a, normalize);
      const bPolygons = fromSurface(b, normalize);
      if (aPolygons.length === 0) {
        z0Surfaces.push(b);
      } else if (bPolygons.length === 0) {
        z0Surfaces.push(a);
      } else {
        const result = clipper.clipToPaths(
          {
            clipType: ClipType.Union,
            subjectInputs: [{ data: aPolygons, closed: true }],
            clipInputs: [{ data: bPolygons, closed: true }],
            subjectFillType: PolyFillType.Positive
          });
        z0Surfaces.push(toSurface(result, normalize));
      }
    }
  }
  return z0Surfaces[0];
};
