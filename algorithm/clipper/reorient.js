import { ClipType, PolyFillType, clipper } from './clipper-lib';
import { fromSurface, toSurface } from './convert';

// Here we have a surface with a confused orientation.
// This reorients the most exterior paths to be ccw.

export const reorient = (surface, normalize = p => p) => {
  const polygons = fromSurface(surface, normalize);
  if (polygons.length === 0) {
    return [];
  }
  const subjectInputs = polygons.map(polygon => ({ data: polygon, closed: true }));
  const result = clipper.clipToPaths(
    {
      clipType: ClipType.Union,
      subjectInputs,
      subjectFillType: PolyFillType.NonZero
    });
  const surfaceResult = toSurface(result, normalize);
  return surfaceResult;
};
