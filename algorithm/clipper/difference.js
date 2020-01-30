import { ClipType, PolyFillType, clipper } from './clipper-lib';
import { fromSurface, toSurface } from './convert';

import { createNormalize2 } from '@jsxcad/algorithm-quantize';
import { doesNotOverlapOrAbut } from './doesNotOverlap';

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
      // const clipper = new Clipper();
      const result = clipper.clipToPaths(
        {
          clipType: ClipType.Difference,
          subjectInputs: [{ data: fromSurface(a, normalize), closed: true }],
          clipInputs: [{ data: fromSurface(b, normalize), closed: true }],
          subjectFillType: PolyFillType.NonZero
        });
      a = toSurface(result, normalize);
    }
  }
  return a;
};
