import * as api from '@jsxcad/api-v1';

import { flip as flipPolygon, toPlane } from '@jsxcad/math-poly3';
import { readFileSync, watchFile, watchFileCreation, writeFileSync } from '@jsxcad/sys';

import { makeConvex as makeConvexSurface } from '@jsxcad/algorithm-surface';
import { toTriangles as polygonsToTriangles } from '@jsxcad/algorithm-polygons';
import { toPolygons as solidToPolygons } from '@jsxcad/algorithm-solid';
import { toSegments } from '@jsxcad/algorithm-path';

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
