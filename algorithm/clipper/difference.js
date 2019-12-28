import { fromSurface, toSurface } from './convert';

import ClipperLib from 'clipper-lib';
import { createNormalize2 } from '@jsxcad/algorithm-quantize';
import { doesNotOverlapOrAbut } from './doesNotOverlap';

const { Clipper, ClipType, PolyType } = ClipperLib;

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
      const clipper = new Clipper();
      clipper.AddPaths(fromSurface(a, normalize), PolyType.ptSubject, true);
      clipper.AddPaths(fromSurface(b, normalize), PolyType.ptClip, true);
      a = toSurface(clipper, ClipType.ctDifference, normalize);
    }
  }
  return a;
};
