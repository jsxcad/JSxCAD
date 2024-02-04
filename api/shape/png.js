import { Group, computeReliefFromImage } from '@jsxcad/geometry';

import Shape from './Shape.js';
import { fromPng } from '@jsxcad/convert-png';
import { fromRaster } from '@jsxcad/algorithm-contour';
import { read } from '@jsxcad/sys';

const readPngAsRasta = async (path) => {
  let data = await read(`source/${path}`, { sources: [path] });
  if (data === undefined) {
    throw Error(`Cannot read png from ${path}`);
  }
  const raster = await fromPng(data);
  return raster;
};

export const LoadPng = Shape.registerMethod3(
  'LoadPng',
  ['functions', 'string', 'numbers', 'options'],
  async (ops, path, bands, { offset = 0.01 } = {}) => {
    if (bands.length === 0) {
      bands = [128, 256];
    }
    const { width, height, pixels } = await readPngAsRasta(path);
    const getPixel = (x, y) => {
      const offset = (y * width + x) << 2;
      // FIX: Use a proper color model to generate the monochromatic value.
      return Math.floor(
        (pixels[offset + 0] + pixels[offset + 1] + pixels[offset + 2]) / 3
      );
    };
    const data = Array(height);
    for (let y = 0; y < height; y++) {
      data[y] = Array(width);
      for (let x = 0; x < width; x++) {
        data[y][x] = getPixel(x, y);
      }
    }
    const rawBands = fromRaster(data, bands, offset);
    const processedBands = [];
    for (let nth = 0; nth < rawBands.length; nth++) {
      const contours = rawBands[nth];
      if (ops[nth] === undefined) {
        processedBands.push(contours);
      } else {
        processedBands.push(await Shape.applyGeometryToGeometry(contours, ops[nth]));
      }
    }
    return Group(processedBands);
  }
);

export const LoadPngAsRelief = Shape.registerMethod3(
  'LoadPngAsRelief',
  ['string', 'options', 'modes:close,noClose'],
  async (
    path,
    {
      minimumValue = 0,
      angularBound,
      radiusBound,
      distanceBound,
      errorBound,
      extrusion,
    } = {},
    { close = true, noClose = false } = {}
  ) => {
    const doClose = close && !noClose;
    const { width, height, pixels } = await readPngAsRasta(path);
    // FIX: This uses the red channel for the value.
    const getPixel = (x, y) => pixels[(y * width + x) << 2];
    const storage = new ArrayBuffer(width * height);
    const data = new Uint8Array(storage);
    let i = 0;
    let maxZ = -Infinity;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const z = Math.min(Math.max(getPixel(x, y) - minimumValue, 0), 255);
        if (z > maxZ) {
          maxZ = z;
        }
        data[i++] = z;
      }
    }
    return computeReliefFromImage(
      width,
      height,
      maxZ,
      data,
      angularBound,
      radiusBound,
      distanceBound,
      errorBound,
      extrusion,
      doClose
    );
  }
);
