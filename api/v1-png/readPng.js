import { Shape } from '@jsxcad/api-shape';
import { fromPng } from '@jsxcad/convert-png';
import { fromRaster } from '@jsxcad/algorithm-contour';
import { read } from '@jsxcad/sys';
import { taggedGroup } from '@jsxcad/geometry';
// import simplifyPathAlgorithm from 'simplify-path';

export const simplifyPath = (path, tolerance = 0.01) => {
  return path;
  /*
  if (isClosedPath(path)) {
    return simplifyPathAlgorithm(path, tolerance);
  } else {
    return [null, ...simplifyPathAlgorithm(path.slice(1), tolerance)];
  }
  */
};

export const readPng = async (path) => {
  let data = await read(`source/${path}`, { sources: [path] });
  if (data === undefined) {
    throw Error(`Cannot read png from ${path}`);
  }
  const raster = await fromPng(data);
  return raster;
};

export const readPngAsContours = async (path, bands = [128, 256]) => {
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
  const contours = await fromRaster(data, bands);
  return Shape.fromGeometry(taggedGroup({}, ...contours));
  // const pathsets = [];
  // const loops = [];
  // for (const contour of contours) {
  // const simplifiedContour = contour.map((path) =>
  //  simplifyPath(path, tolerance)
  // );
  // loops.push(Shape.fromGeometry(taggedPoints({}, contour)).loop());
  // pathsets.push(taggedPaths({}, simplifiedContour));
  // return Shape.fromGeometry(taggedGroup({}, ...pathsets));
  // return Group(...loops);
};

export default readPng;
