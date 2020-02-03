import { CLEAN_DISTANCE, RESOLUTION, fromSurfaceAsClosedPaths } from './convert';
import { ClipType, PolyFillType, clipper } from './clipper-lib';

import earcut from 'earcut';
import { isClockwise } from '@jsxcad/geometry-path';

export const makeConvex = (surface, normalize = p => p) => {
  if (surface.length === 0) {
    return [];
  }
  const subjectInputs = fromSurfaceAsClosedPaths(surface, normalize);
  if (subjectInputs.length === 0) {
    return [];
  }
  const request =
    {
      clipType: ClipType.Union,
      subjectInputs,
      subjectFillType: PolyFillType.Positive
    };
  const result = clipper.clipToPolyTree(request);
  const convexSurface = [];

  // eslint-disable-next-line camelcase
  const walkContour = ({ contour, childs }) => {
    const earContour = [];
    const holes = [];
    for (const { x, y } of clipper.cleanPolygon(contour, CLEAN_DISTANCE)) {
      earContour.push(x, y);
    }
    // eslint-disable-next-line camelcase
    for (const child of childs) {
      walkHole(child, earContour, holes);
    }
    const triangles = earcut(earContour, holes);
    for (let i = 0; i < triangles.length; i += 3) {
      const a = triangles[i + 0];
      const b = triangles[i + 1];
      const c = triangles[i + 2];
      const triangle = [[earContour[a * 2 + 0] / RESOLUTION, earContour[a * 2 + 1] / RESOLUTION, 0],
                        [earContour[b * 2 + 0] / RESOLUTION, earContour[b * 2 + 1] / RESOLUTION, 0],
                        [earContour[c * 2 + 0] / RESOLUTION, earContour[c * 2 + 1] / RESOLUTION, 0]];
      if (isClockwise(triangle)) {
        triangle.reverse();
      }
      convexSurface.push(triangle);
    }
  };

  // eslint-disable-next-line camelcase
  const walkHole = ({ contour, childs }, earContour, holes) => {
    const start = earContour.length;
    for (const { x, y } of clipper.cleanPolygon(contour, CLEAN_DISTANCE)) {
      earContour.push(x, y);
    }
    if (earContour.length > start) {
      holes.push(start >>> 1);
    }
    // eslint-disable-next-line camelcase
    for (const child of childs) {
      walkContour(child);
    }
  };

  for (const child of result.childs) {
    walkContour(child);
  }

  return convexSurface.map(path => path.map(normalize));
};
