import { CLEAN_DISTANCE, RESOLUTION, fromClosedPath } from './convert';
import { ClipType, PolyFillType, clipper } from './clipper-lib';

import earcut from 'earcut';
import { isClockwise } from '@jsxcad/geometry-path';

export const makeConvex = (surface, normalize = p => p) => {
  const result = clipper.clipToPolyTree(
    {
      clipType: ClipType.Union,
      subjectInputs: surface.map(path => fromClosedPath(path, normalize)),
      subjectFillType: PolyFillType.NonZero
    });

  const convexSurface = [];

  // eslint-disable-next-line camelcase
  const walkContour = ({ contour, childs }) => {
    const cleanContour = [];
    const holes = [];
    for (const { x, y } of clipper.cleanPolygon(contour, CLEAN_DISTANCE)) {
      cleanContour.push(x, y);
    }
    // eslint-disable-next-line camelcase
    for (const child of childs) {
      walkHole(child, cleanContour, holes);
    }
    const triangles = earcut(cleanContour, holes);
    for (let i = 0; i < triangles.length; i += 3) {
      const a = triangles[i + 0];
      const b = triangles[i + 1];
      const c = triangles[i + 2];
      const triangle = [[cleanContour[a * 2 + 0] / RESOLUTION, cleanContour[a * 2 + 1] / RESOLUTION, 0],
                        [cleanContour[b * 2 + 0] / RESOLUTION, cleanContour[b * 2 + 1] / RESOLUTION, 0],
                        [cleanContour[c * 2 + 0] / RESOLUTION, cleanContour[c * 2 + 1] / RESOLUTION, 0]];
      if (isClockwise(triangle)) {
        triangle.reverse();
      }
      convexSurface.push(triangle);
    }
  };

  // eslint-disable-next-line camelcase
  const walkHole = ({ contour, childs }, cleanContour, holes) => {
    const start = cleanContour.length;
    for (const { x, y } of clipper.cleanPolygon(contour, CLEAN_DISTANCE)) {
      cleanContour.push(x, y);
    }
    if (contour.length > start) {
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

  return convexSurface;
};
