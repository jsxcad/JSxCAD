import { fromSurface, toSurface } from './convert';

import ClipperLib from 'clipper-lib-fpoint';
import { doesNotOverlapOrAbut } from './doesNotOverlap';

const { Clipper, ClipType, PolyFillType, PolyType } = ClipperLib;

export const difference = (a, ...z0Surfaces) => {
  if (a === undefined || a.length === 0) {
    return [];
  }
  while (z0Surfaces.length >= 1) {
    const b = z0Surfaces.shift();
    if (b.length === 0) {
      continue;
    } else if (doesNotOverlapOrAbut(a, b)) {
      continue;
    } else {
      const clipper = new Clipper();
      clipper.AddPaths(fromSurface(a), PolyType.ptSubject, true);
      clipper.AddPaths(fromSurface(b), PolyType.ptClip, true);
      const result = [];
      clipper.Execute(ClipType.ctDifference, result, PolyFillType.pftNonZero, PolyFillType.pftNonZero);
      a = toSurface(result);
    }
  }
  return a;
};
