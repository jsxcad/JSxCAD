import Shape from '@jsxcad/api-v1-shape';
import { fromPng } from '@jsxcad/convert-png';
import { fromRaster } from '@jsxcad/algorithm-contour';
import { numbers } from '@jsxcad/api-v1-math';
import { readFile } from '@jsxcad/sys';
import { simplifyPath } from '@jsxcad/algorithm-shape';

/**
 *
 * # Read PNG
 *
 **/

export const readPng = async (path, { src }) => {
  let data = await readFile({ doSerialize: false }, `source/${path}`);
  if (data === undefined) {
    data = await readFile({ sources: [src] }, `cache/${path}`);
  }
  const raster = await fromPng(data);
  return raster;
};

export const readPngAsContours = async (
  path,
  { src, by = 10, tolerance = 5 } = {}
) => {
  const { width, height, pixels } = await readPng(path, { src });
  // FIX: This uses the red channel for the value.
  const getPixel = (x, y) => pixels[(y * width + x) << 2];
  const data = Array(height);
  for (let y = 0; y < height; y++) {
    data[y] = Array(width);
    for (let x = 0; x < width; x++) {
      data[y][x] = getPixel(x, y);
    }
  }
  const bands = numbers((a) => a, { to: 256, by });
  const contours = await fromRaster(data, bands);
  const geometry = { assembly: [] };
  for (const contour of contours) {
    const simplifiedContour = contour.map((path) =>
      simplifyPath(path, tolerance)
    );
    geometry.assembly.push({ paths: simplifiedContour });
  }
  return Shape.fromGeometry(geometry);
};

export default readPng;
