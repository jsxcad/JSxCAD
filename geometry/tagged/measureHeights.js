import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { createOpenPath } from '@jsxcad/geometry-path';
import { eachPoint as eachPointOfPaths } from '@jsxcad/geometry-paths';
import { measureBoundingBox } from './measureBoundingBox.js';
import { removeExteriorPaths } from '@jsxcad/geometry-bsp';
import { toBspTree } from './toBspTree.js';

const X = 0;
const Y = 1;
const Z = 2;

export const measureHeights = (geometry, resolution = 1) => {
  const normalize = createNormalize3();
  const [min, max] = measureBoundingBox(geometry);
  const bspTree = toBspTree(geometry, normalize);
  const paths = [];
  const minX = Math.floor(min[X]);
  const maxX = Math.ceil(max[X]);
  const minY = Math.floor(min[Y]);
  const maxY = Math.ceil(max[Y]);
  for (let x = minX; x <= maxX; x += resolution) {
    for (let y = minY; y <= maxY; y += resolution) {
      paths.push(
        createOpenPath(normalize([x, y, min[Z]]), normalize([x, y, max[Z]]))
      );
    }
  }
  const clippedPaths = [];
  removeExteriorPaths(bspTree, paths, normalize, (paths) =>
    clippedPaths.push(...paths)
  );
  const heights = new Map();
  const op = (point) => {
    const key = `${point[X]}/${point[Y]}`;
    if (!heights.has(key) || heights.get(key)[Z] < point[Z]) {
      heights.set(key, point);
    }
  };
  eachPointOfPaths(op, clippedPaths);
  return [...heights.values()];
};
