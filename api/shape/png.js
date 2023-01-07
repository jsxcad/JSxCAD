import Shape from './Shape.js';
import { fromPng } from '@jsxcad/convert-png';
import { fromRaster } from '@jsxcad/algorithm-contour';
import { read } from '@jsxcad/sys';
import { taggedGroup } from '@jsxcad/geometry';

const readPngAsRasta = async (path) => {
  let data = await read(`source/${path}`, { sources: [path] });
  if (data === undefined) {
    throw Error(`Cannot read png from ${path}`);
  }
  const raster = await fromPng(data);
  return raster;
};

export const LoadPng = Shape.registerMethod(
  'LoadPng',
  (path, bands = [128, 256]) =>
    async (shape) => {
      const { width, height, pixels } = await readPngAsRasta(path);
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
    }
);
