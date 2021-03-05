import { taggedGroup, taggedPaths } from '@jsxcad/geometry-tagged';

import Shape from '@jsxcad/api-v1-shape';
import { fromPng } from '@jsxcad/convert-png';
import { fromRaster } from '@jsxcad/algorithm-contour';
import { isClosed } from '@jsxcad/geometry-path';
import { numbers } from '@jsxcad/api-v1-math';
import { read } from '@jsxcad/sys';
import simplifyPathAlgorithm from 'simplify-path';

export const simplifyPath = (path, tolerance = 0.01) => {
  if (isClosed(path)) {
    return simplifyPathAlgorithm(path, tolerance);
  } else {
    return [null, ...simplifyPathAlgorithm(path.slice(1), tolerance)];
  }
};

/**
 *
 * # Read PNG
 *
 **/

export const readPng = async (path) => {
  let data = await read(`source/${path}`, { sources: [path] });
  if (data === undefined) {
    throw Error(`Cannot read png from ${path}`);
  }
  const raster = await fromPng(data);
  return raster;
};

export const readPngAsContours = async (
  path,
  { by = 10, tolerance = 5, to = 256 } = {}
) => {
  const { width, height, pixels } = await readPng(path);
  // FIX: This uses the red channel for the value.
  const getPixel = (x, y) => pixels[(y * width + x) << 2];
  const data = Array(height);
  for (let y = 0; y < height; y++) {
    data[y] = Array(width);
    for (let x = 0; x < width; x++) {
      data[y][x] = getPixel(x, y);
    }
  }
  const bands = numbers((a) => a, { to, by });
  const contours = await fromRaster(data, bands);
  const pathsets = [];
  for (const contour of contours) {
    const simplifiedContour = contour.map((path) =>
      simplifyPath(path, tolerance)
    );
    pathsets.push(taggedPaths({}, simplifiedContour));
  }
  return Shape.fromGeometry(taggedGroup({}, ...pathsets));
};

export default readPng;
