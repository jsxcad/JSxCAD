import * as api from '@jsxcad/api-v1';
import { readFileSync, watchFile, watchFileCreation, writeFileSync } from '@jsxcad/sys';
import { toSegments } from '@jsxcad/algorithm-path';
import { toTriangles as polygonsToTriangles } from '@jsxcad/algorithm-polygons';
import { toPolygons as solidToPolygons } from '@jsxcad/algorithm-solid';
import { flip as flipPolygon, toPlane } from '@jsxcad/math-poly3';
import { makeConvex as makeConvexSurface } from '@jsxcad/algorithm-surface';

export {
  api,
  flipPolygon,
  makeConvexSurface,
  polygonsToTriangles,
  toPlane,
  readFileSync,
  solidToPolygons,
  toSegments,
  watchFile,
  watchFileCreation,
  writeFileSync
};
