import { ClipType, PolyFillType, clipper } from './clipper-lib.js';
import { fromPaths, fromSurfaceAsClosedPaths, toPaths } from './convert.js';

import { createNormalize2 } from '@jsxcad/algorithm-quantize';
import { doesNotOverlapOrAbut } from './doesNotOverlap.js';

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
      const unifiedClipInputs = [
        {
          data: clipper.clipToPaths({
            clipType: ClipType.Union,
            subjectInputs: clipInputs,
            clipInputs: clipInputs,
            subjectFillType: PolyFillType.Positive,
          }),
          closed: true,
        },
      ];
      const result = clipper.clipToPolyTree({
        clipType: ClipType.Intersection,
        subjectInputs,
        clipInputs: unifiedClipInputs,
        subjectFillType: PolyFillType.Positive,
      });
      a = toPaths(clipper, result, normalize);
    }
  }
  return a;
};
