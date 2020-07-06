import { ClipType, PolyFillType, clipper } from './clipper-lib.js';
import { fromSurface, toSurface } from './convert.js';

import { createNormalize2 } from '@jsxcad/algorithm-quantize';
import { doesNotOverlapOrAbut } from './doesNotOverlap.js';
import { makeConvex } from './makeConvex.js';

export const difference = (a, ...z0Surfaces) => {
  if (a === undefined || a.length === 0) {
    return [];
  }
  const normalize = createNormalize2();
  while (z0Surfaces.length >= 1) {
    const b = z0Surfaces.shift();
    if (b.length === 0) {
      continue;
    } else if (doesNotOverlapOrAbut(a, b)) {
      continue;
    } else {
      const aPolygons = fromSurface(a, normalize);
      if (aPolygons.length === 0) {
        return [];
      }
      const bPolygons = fromSurface(b, normalize);
      if (bPolygons.length === 0) {
        continue;
      }
      const result = clipper.clipToPaths({
        clipType: ClipType.Difference,
        subjectInputs: [{ data: aPolygons, closed: true }],
        clipInputs: [{ data: bPolygons, closed: true }],
        subjectFillType: PolyFillType.Positive,
      });
      a = toSurface(result, normalize);
    }
  }
  return makeConvex(a, normalize);
};
