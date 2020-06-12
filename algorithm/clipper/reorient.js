import { ClipType, PolyFillType, clipper } from "./clipper-lib";

import {
  fromIntegersToClosedPaths,
  fromSurfaceToIntegers,
  toSurface,
} from "./convert";

import { fixTJunctions } from "./fixTJunctions";

// Here we have a surface with a confused orientation.
// This reorients the most exterior paths to be ccw.

export const reorient = (surface, normalize = (p) => p) => {
  const integers = fromSurfaceToIntegers(surface, normalize);
  const fixed = fixTJunctions(integers);
  const subjectInputs = fromIntegersToClosedPaths(fixed);
  if (subjectInputs.length === 0) {
    return [];
  }
  const result = clipper.clipToPaths({
    clipType: ClipType.Union,
    subjectInputs,
    subjectFillType: PolyFillType.NonZero,
  });
  return toSurface(result, normalize);
};
