import { fillType, fromSurface } from './convert';

import ClipperLib from 'clipper-lib';
import { createNormalize2 } from '@jsxcad/algorithm-quantize';
import earcut from 'earcut';
import { isClockwise } from '@jsxcad/geometry-path';

const { Clipper, ClipType, PolyTree, PolyType } = ClipperLib;

const magnitude = 1e5;

export const makeConvex = (surface, normalize = createNormalize2()) => {
  const clipper = new Clipper();
  clipper.AddPaths(fromSurface(surface, normalize), PolyType.ptSubject, true);
  const result = new PolyTree();
  clipper.Execute(ClipType.ctUnion, result, fillType, fillType);

  const convexSurface = [];

  const walkContour = ({ m_polygon, m_Childs }) => {
    const contour = [];
    const holes = [];
    for (const { X, Y } of Clipper.CleanPolygon(m_polygon, 1)) {
      contour.push(X, Y);
    }
    for (const child of m_Childs) {
      walkHole(child, contour, holes);
    }
    const triangles = earcut(contour, holes);
    for (let i = 0; i < triangles.length; i += 3) {
      const a = triangles[i + 0];
      const b = triangles[i + 1];
      const c = triangles[i + 2];
      const triangle = [[contour[a * 2 + 0] / magnitude, contour[a * 2 + 1] / magnitude, 0],
                        [contour[b * 2 + 0] / magnitude, contour[b * 2 + 1] / magnitude, 0],
                        [contour[c * 2 + 0] / magnitude, contour[c * 2 + 1] / magnitude, 0]];
      if (isClockwise(triangle)) {
        triangle.reverse();
      }
      convexSurface.push(triangle);
    }
  }

  const walkHole = ({ m_polygon, m_Childs }, contour, holes) => {
    const start = contour.length;
    for (const { X, Y } of Clipper.CleanPolygon(m_polygon, 1)) {
      contour.push(X, Y);
    }
    if (contour.length > start) {
      holes.push(start >>> 1);
    }
    for (const child of m_Childs) {
      walkContour(child);
    }
  }

  for (const child of result.m_Childs) {
    walkContour(child);
  }

  return convexSurface;
};
