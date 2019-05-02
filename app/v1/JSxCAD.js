import * as api from '@jsxcad/api-v1';

import { flip as flipPolygon, toPlane } from '@jsxcad/math-poly3';
import { readFileSync, watchFile, watchFileCreation, writeFileSync } from '@jsxcad/sys';

import { makeConvex as makeConvexSurface } from '@jsxcad/geometry-surface';
import { toTriangles as polygonsToTriangles } from '@jsxcad/geometry-polygons';
import { toPolygons as solidToPolygons } from '@jsxcad/geometry-solid';
import { toSegments } from '@jsxcad/geometry-path';

export {
  api,
  flipPolygon,
  makeConvexSurface,
  polygonsToTriangles,
  readFileSync,
  solidToPolygons,
  toPlane,
  toSegments,
  watchFile,
  watchFileCreation,
  writeFileSync
};
