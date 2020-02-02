import { isClosed, isOpen } from '@jsxcad/geometry-path';

import ClipperLib from 'clipper-lib';

const { Clipper, IntPoint, PolyFillType, PolyTree } = ClipperLib;

// CHECK: Should this be sqrt(2)?
const CLEAN_DISTANCE = 1;

export const RESOLUTION = 1e7;

const toInt = (integer) => Math.round(integer * RESOLUTION);
const toFloat = (integer) => integer / RESOLUTION;

export const fillType = PolyFillType.pftNonZero;

export const fromSurface = (surface, normalize) =>
  surface.map(path => path.map(point => { const [X, Y] = normalize(point); return new IntPoint(toInt(X), toInt(Y)); }));

export const fromOpenPaths = (paths, normalize) => {
  const openPaths = [];
  for (const path of paths) {
    if (isOpen(path)) {
      const openPath = [];
      for (let i = 1; i < path.length; i++) {
        const [X, Y] = normalize(path[i]);
        openPath.push(new IntPoint(toInt(X), toInt(Y)));
      }
      openPaths.push(openPath);
    }
  }
  return openPaths;
};

export const fromClosedPaths = (paths, normalize) => {
  const closedPaths = [];
  for (const path of paths) {
    if (isClosed(path)) {
      const closedPath = [];
      for (let i = 0; i < path.length; i++) {
        const [X, Y] = normalize(path[i]);
        closedPath.push(new IntPoint(toInt(X), toInt(Y)));
      }
      closedPaths.push(closedPath);
    }
  }
  return closedPaths;
};

export const toSurface = (clipper, op, normalize) => {
  const result = [];
  clipper.Execute(op, result, fillType, fillType);
  const cleaned = Clipper.CleanPolygons(result, CLEAN_DISTANCE);
  // CHECK: Do we need to renormalize here?
  const surface = [];
  for (const path of cleaned) {
    if (path.length > 0) {
      surface.push(path.map(({ X, Y }) => normalize([toFloat(X), toFloat(Y)])));
    }
  }
  return surface;
};

export const toPaths = (clipper, op, normalize) => {
  const result = new PolyTree();
  clipper.Execute(op, result, fillType, fillType);
  // CHECK: Do we need to renormalize here?
  const paths = [];
  for (const entry of result.m_AllPolys) {
    if (entry.m_polygon.length > 0) {
      if (entry.IsOpen) {
        paths.push([null, ...entry.m_polygon.map(({ X, Y }) => normalize([toFloat(X), toFloat(Y)]))]);
      } else {
        paths.push(entry.m_polygon.map(({ X, Y }) => normalize([toFloat(X), toFloat(Y)])));
      }
    }
  }
  return paths;
};
