import { IntPoint, PolyFillType, clipper } from './clipper-lib';
import { isClosed, isOpen } from '@jsxcad/geometry-path';

// CHECK: Should this be sqrt(2)?
export const CLEAN_DISTANCE = 1;

export const RESOLUTION = 1e7;

const toInt = (integer) => Math.round(integer * RESOLUTION);
const toFloat = (integer) => integer / RESOLUTION;

export const fillType = PolyFillType.pftNonZero;

export const fromSurface = (surface, normalize) =>
  surface.map(path => path.map(point => { const [X, Y] = normalize(point); return new IntPoint(toInt(X), toInt(Y)); }));

export const fromClosedPath = (path, normalize) => {
  const closedPath = [];
  for (let i = 0; i < path.length; i++) {
    const [x, y] = normalize(path[i]);
    closedPath.push(new IntPoint(toInt(x), toInt(y)));
  }
  const entry = { data: clipper.cleanPolygon(closedPath, CLEAN_DISTANCE), closed: true };
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

export const fromClosedPaths = (paths, normalize) => {
  const closedPaths = [];
  for (const path of paths) {
    if (isClosed(path)) {
      const closedPath = [];
      for (let i = 0; i < path.length; i++) {
        const [x, y] = normalize(path[i]);
        closedPath.push(new IntPoint(toInt(x), toInt(y)));
      }
      closedPaths.push(clipper.simplifyPolygon(closedPath, CLEAN_DISTANCE));
    }
  }
  return closedPaths;
};

export const toSurface = (clipperPaths, normalize) =>
  clipperPaths.map(clipperPath => clipperPath.map(({ x, y }) => normalize([toFloat(x), toFloat(y), 0])));

export const toPaths = (clipper, polytree, normalize) => {
  const paths = [];
  for (const path of clipper.openPathsFromPolyTree(polytree)) {
    paths.push([null, ...path.map(({ x, y }) => normalize([toFloat(x), toFloat(y), 0]))]);
  }
  for (const path of clipper.closedPathsFromPolyTree(polytree)) {
    paths.push(path.map(({ x, y }) => normalize([toFloat(x), toFloat(y), 0])));
  }
  return paths;
};
