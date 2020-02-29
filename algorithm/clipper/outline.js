import { ClipType, PolyFillType, clipper } from './clipper-lib';
import { fromSurface, toSurface } from './convert';

export const outline = (surface, normalize = p => p) => {
  const polygons = fromSurface(surface, normalize);
  if (polygons.length === 0) {
    return [];
  }
  const subjectInputs = polygons.map(polygon => ({ data: polygon, closed: true }));
  const result = clipper.clipToPaths(
    {
      clipType: ClipType.Union,
      subjectInputs,
      subjectFillType: PolyFillType.Positive
    });
  const surfaceResult = toSurface(result, normalize);
  return surfaceResult;
};
