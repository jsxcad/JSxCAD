import {
  ClipType,
  PolyFillType,
  clipper
} from './clipper-lib';

import {
  fromSurfaceAsClosedPaths,
  toSurface
} from './convert';

import {
  fixTJunctions
} from './fixTJunctions';

// Here we have a surface with a confused orientation.
// This reorients the most exterior paths to be ccw.

export const reorient = (surface, normalize = p => p) => {
  const subjectInputs = fromSurfaceAsClosedPaths(fixTJunctions(surface), normalize);
  if (subjectInputs.length === 0) {
    return [];
  }
  const result = clipper.clipToPaths(
    {
      clipType: ClipType.Union,
      subjectInputs,
      subjectFillType: PolyFillType.NonZero
    });
  const surfaceResult = toSurface(result, normalize);
  return surfaceResult;
};
