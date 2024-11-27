import {
  Group,
  computeReliefFromImage,
  ensurePages,
  render,
} from '@jsxcad/geometry';
import { MODES, viewOp } from './view.js';
import { fromPng, toPng } from '@jsxcad/convert-png';
import { generateUniqueId, getSourceLocation, read, write } from '@jsxcad/sys';

import Shape from './Shape.js';
import { fromRaster } from '@jsxcad/algorithm-contour';
import { renderPng } from '@jsxcad/convert-threejs';

const computeDotProduct = ([x1, y1, z1], [x2, y2, z2]) =>
  x1 * x2 + y1 * y2 + z1 * z2;

const computeLength = (v) => Math.sqrt(computeDotProduct(v, v));

const normalize = (v) => {
  const l = computeLength(v);
  return [v[0] / l, v[1] / l, v[2] / l];
};

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
  ['function', 'string', 'numbers', 'options'],
  async (op, path, bands, { offset = 0.01 } = {}) => {
    if (bands.length === 0) {
      bands = [0.5, 1.0];
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
    const rawBands = fromRaster(
      data,
      bands.map((band) => band * 256),
      offset
    );
    const processedBands = [];
    for (let nth = 0; nth < rawBands.length; nth++) {
      const contours = rawBands[nth];
      processedBands.push(
        await Shape.applyGeometryToGeometry(
          contours,
          op,
          bands[nth],
          bands[nth + 1]
        )
      );
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

export const png = Shape.registerMethod3(
  'png',
  ['inputGeometry', MODES, 'function', 'options', 'value'],
  async (geometry, modes, op = (_x) => (s) => s, options, viewId) => {
    const downloadOp = async (
      geometry,
      { view, path, id }
    ) => {
      const { name, height, viewId, width } = view;
      const pngPath = `download/png/${path}/${id}/${viewId}`;
      await write(
        pngPath,
        await renderPng(
          { geometry, view },
          { offsetWidth: width, offsetHeight: height }
        )
      );
      const filename = `${name}.png`;
      const record = {
        path: pngPath,
        filename,
        type: 'image/png',
      };
      return { entries: [record] };
    };
    return viewOp(geometry, modes, op, { ...options, downloadOp }, viewId);
  }
);

export const raycastPng = Shape.registerMethod3(
  'raycastPng',
  [
    'inputGeometry',
    'string',
    'function',
    'number',
    'number',
    'number',
    'number',
    'options',
  ],
  async (
    geometry,
    name,
    op = (_v) => (s) => s,
    implicitLength,
    implicitWidth,
    implicitHeight,
    implicitResolution,
    {
      length = implicitLength,
      width = implicitWidth,
      height = implicitHeight,
      resolution = implicitResolution,
      view = {},
    } = {}
  ) => {
    const light = [0, 0, 1];
    const color = [1, 1, 1];
    const { path } = getSourceLocation();
    let index = 0;
    const updatedGeometry = await Shape.applyToGeometry(geometry, op);
    for (const entry of ensurePages(updatedGeometry)) {
      const pngPath = `download/png/${path}/${generateUniqueId()}`;
      const { xSteps, ySteps, points } = render(entry, {
        length,
        width,
        height,
        resolution,
      });
      const pixels = new Uint8Array(points.length);
      let lastPixel = 0;
      for (let nth = 0; nth < points.length; nth += 4) {
        const normal = normalize([
          points[nth + 1],
          points[nth + 2],
          points[nth + 3],
        ]);
        const dot = computeDotProduct(light, normal);
        if (dot < 0) {
          pixels[lastPixel++] = 0;
          pixels[lastPixel++] = 0;
          pixels[lastPixel++] = 0;
          pixels[lastPixel++] = 0;
        } else {
          const cos = Math.abs(dot);
          const r = color[0] * cos;
          const g = color[1] * cos;
          const b = color[2] * cos;
          const i = 1;
          pixels[lastPixel++] = Math.floor(r * 255);
          pixels[lastPixel++] = Math.floor(g * 255);
          pixels[lastPixel++] = Math.floor(b * 255);
          pixels[lastPixel++] = Math.floor(i * 255);
        }
      }
      await write(
        pngPath,
        await toPng({ width: xSteps, height: ySteps, bytes: pixels })
      );
      const suffix = index++ === 0 ? '' : `_${index}`;
      const filename = `${name}${suffix}.png`;
      const record = {
        path: pngPath,
        filename,
        type: 'image/png',
      };
      // Produce a view of what will be downloaded.
      await viewOp(name, { ...view, download: { entries: [record] } })(
        Shape.fromGeometry(entry)
      );
    }
    return geometry;
  }
);
