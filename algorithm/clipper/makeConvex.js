import {
  CLEAN_DISTANCE,
  RESOLUTION,
  fromSurfaceAsClosedPaths,
} from './convert.js';
import { ClipType, PolyFillType, clipper } from './clipper-lib.js';
import { flip, isClockwise } from '@jsxcad/geometry-path';

import { createNormalize2 } from '@jsxcad/algorithm-quantize';
import earcut from 'earcut';
import { toPlane } from '@jsxcad/math-poly3';

export const makeConvex = (surface, normalize = createNormalize2()) => {
  if (surface.length === 0) {
    return [];
  }
  const subjectInputs = fromSurfaceAsClosedPaths(surface, normalize);
  if (subjectInputs.length === 0) {
    return [];
  }
  const request = {
    clipType: ClipType.Union,
    subjectInputs,
    subjectFillType: PolyFillType.Positive,
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
      const triangle = [
        normalize([
          earContour[a * 2 + 0] / RESOLUTION,
          earContour[a * 2 + 1] / RESOLUTION,
          0,
        ]),
        normalize([
          earContour[b * 2 + 0] / RESOLUTION,
          earContour[b * 2 + 1] / RESOLUTION,
          0,
        ]),
        normalize([
          earContour[c * 2 + 0] / RESOLUTION,
          earContour[c * 2 + 1] / RESOLUTION,
          0,
        ]),
      ];
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

  const normalized = convexSurface
    .map((path) => path.map(normalize))
    .filter((path) => toPlane(path) !== undefined);
  const rectified = [];
  for (const polygon of normalized) {
    if (isClockwise(polygon)) {
      rectified.push(flip(polygon));
    } else {
      rectified.push(polygon);
    }
  }
  return normalized;
};
