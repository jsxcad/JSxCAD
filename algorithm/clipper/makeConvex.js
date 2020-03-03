import { CLEAN_DISTANCE, RESOLUTION, fromSurfaceAsClosedPaths } from './convert';
import { ClipType, PolyFillType, clipper } from './clipper-lib';

import { createNormalize2 } from '@jsxcad/algorithm-quantize';
import earcut from 'earcut';
import { isClockwise } from '@jsxcad/geometry-path';
import { toPlane } from '@jsxcad/math-poly3';

export const makeConvex = (surface, normalize = createNormalize2()) => {
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
      const triangle = [normalize([earContour[a * 2 + 0] / RESOLUTION, earContour[a * 2 + 1] / RESOLUTION, 0]),
                        normalize([earContour[b * 2 + 0] / RESOLUTION, earContour[b * 2 + 1] / RESOLUTION, 0]),
                        normalize([earContour[c * 2 + 0] / RESOLUTION, earContour[c * 2 + 1] / RESOLUTION, 0])];
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

  const normalized = convexSurface.map(path => path.map(normalize)).filter(path => toPlane(path) !== undefined);
  for (const p of normalized) {
    if (JSON.stringify(p) === "[[-84.82442949541505,-9.881966011250102,0],[-84.82442604432079,-9.8819766326261,0],[-71.82786611255239,-9.881920579617445,0],[-84.82442604432079,-9.8819766326261,0]]") {
      throw Error('die');
    }
  }
  return normalized;
};
