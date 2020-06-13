import {
  deduplicate,
  isClockwise,
  isClosed,
  isOpen,
} from '@jsxcad/geometry-path';

import { IntPoint } from './clipper-lib';
import { toPlane } from '@jsxcad/math-poly3';

// CHECK: Should this be sqrt(2)?
export const CLEAN_DISTANCE = 1;

export const RESOLUTION = 1e6;

const clockOrder = (a) => (isClockwise(a) ? 1 : 0);

// Reorder in-place such that counterclockwise paths preceed clockwise paths.
const clockSort = (surface) => {
  surface.sort((a, b) => clockOrder(a) - clockOrder(b));
  return surface;
};

const toInt = (integer) => Math.round(integer * RESOLUTION);
const toFloat = (integer) => integer / RESOLUTION;

export const fromSurface = (surface, normalize) => {
  const normalized = surface.map((path) => path.map(normalize));
  const scaled = normalized.map((path) =>
    path.map(([X, Y]) => [toInt(X), toInt(Y), 0])
  );
  const filtered = scaled.filter((path) => toPlane(path) !== undefined);
  return filtered.map((path) => path.map(([X, Y]) => new IntPoint(X, Y)));
};

export const fromSurfaceAsClosedPaths = (surface, normalize) => {
  const normalized = surface.map((path) => path.map(normalize));
  const integers = normalized.map((path) =>
    path.map(([X, Y]) => [toInt(X), toInt(Y), 0])
  );
  const filtered = integers.filter((path) => toPlane(path) !== undefined);
  return filtered.map((path) => ({
    data: path.map(([X, Y]) => new IntPoint(X, Y)),
    closed: true,
  }));
};

export const fromSurfaceToIntegers = (surface, normalize) => {
  const normalized = surface.map((path) => path.map(normalize));
  const integers = normalized.map((path) =>
    path.map(([X, Y]) => [toInt(X), toInt(Y), 0])
  );
  return integers;
};

export const fromIntegersToClosedPaths = (integers) => {
  return integers.map((path) => ({
    data: path.map(([X, Y]) => new IntPoint(X, Y)),
    closed: true,
  }));
};

export const fromClosedPath = (path, normalize) => {
  const closedPath = [];
  for (let i = 0; i < path.length; i++) {
    const [x, y] = normalize(path[i]);
    closedPath.push(new IntPoint(toInt(x), toInt(y)));
  }
  const entry = { data: closedPath, closed: true };
  return entry;
};

export const fromOpenPaths = (paths, normalize) => {
  const openPaths = [];
  for (const path of paths) {
    if (isOpen(path)) {
      const openPath = [];
      for (let i = 1; i < path.length; i++) {
        const [x, y] = normalize(path[i]);
        openPath.push(new IntPoint(toInt(x), toInt(y)));
      }
      openPaths.push(openPath);
    }
  }
  return openPaths;
};

export const fromPaths = (paths, normalize) => {
  const clipperPaths = [];
  const closedPaths = fromClosedPaths(paths, normalize);
  if (closedPaths.length > 0) {
    clipperPaths.push({ data: closedPaths, closed: true });
  }
  const openPaths = fromOpenPaths(paths, normalize);
  if (openPaths.length > 0) {
    clipperPaths.push({ data: openPaths, closed: false });
  }
  return clipperPaths;
};

export const fromClosedPaths = (paths, normalize) => {
  const closedPaths = [];
  for (const path of paths) {
    if (isClosed(path)) {
      const closedPath = [];
      for (let i = 0; i < path.length; i++) {
        const [x, y] = normalize(path[i]);
        closedPath.push(new IntPoint(toInt(x), toInt(y)));
      }
      closedPaths.push(closedPath);
    }
  }
  return closedPaths;
};

export const toSurface = (clipperPaths, normalize) =>
  clockSort(
    clipperPaths.map((clipperPath) =>
      deduplicate(
        clipperPath.map(({ x, y }) => normalize([toFloat(x), toFloat(y), 0]))
      )
    )
  );

export const toPaths = (clipper, polytree, normalize) => {
  const paths = [];
  for (const path of clipper.openPathsFromPolyTree(polytree)) {
    paths.push([
      null,
      ...path.map(({ x, y }) => normalize([toFloat(x), toFloat(y), 0])),
    ]);
  }
  for (const path of clipper.closedPathsFromPolyTree(polytree)) {
    paths.push(path.map(({ x, y }) => normalize([toFloat(x), toFloat(y), 0])));
  }
  return paths;
};
