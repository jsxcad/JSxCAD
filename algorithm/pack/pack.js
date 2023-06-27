import {
  measureBoundingBox,
  toTransformedGeometry,
  translate,
} from '@jsxcad/geometry';

import BinPackingEs from 'bin-packing-es/build/bin-packing.js';

const { GrowingPacker, Packer } = BinPackingEs;

const max = ([ax, ay, az], [bx, by, bz]) => [
  Math.max(ax, bx),
  Math.max(ay, by),
  Math.max(az, bz),
];

const min = ([ax, ay, az], [bx, by, bz]) => [
  Math.min(ax, bx),
  Math.min(ay, by),
  Math.min(az, bz),
];

const X = 0;
const Y = 1;
const Z = 2;

const measureSize = (geometry) => {
  const bounds = measureBoundingBox(geometry);
  if (bounds === undefined) {
    return;
  }
  const [min, max] = bounds;
  const width = max[X] - min[X];
  const height = max[Y] - min[Y];
  return [width, height, min[Z]];
};

const measureOrigin = (geometry) => {
  const [min] = measureBoundingBox(geometry);
  const [x, y] = min;
  return [x, y];
};

const measureOffsets = (size, pageMargin) => {
  if (size) {
    const [width, height] = size;

    // Center the output to match pages.
    const xOffset = width / -2;
    const yOffset = height / -2;
    const packer = new Packer(width - pageMargin * 2, height - pageMargin * 2);

    return [xOffset, yOffset, packer];
  } else {
    const packer = new GrowingPacker();
    return [0, 0, packer];
  }
};

export const pack = (
  { size, itemMargin = 1, pageMargin = 5 },
  ...geometries
) => {
  const [xOffset, yOffset, packer] = measureOffsets(size, pageMargin);

  const packedGeometries = [];
  const unpackedGeometries = [];

  const blocks = [];

  for (const geometry of geometries) {
    const size = measureSize(geometry);
    if (size === undefined) {
      continue;
    }
    const [width, height, minZ] = size;
    if (!isFinite(width) || !isFinite(height)) {
      continue;
    }
    const [w, h] = [width + itemMargin * 2, height + itemMargin * 2];
    blocks.push({ w, h, minZ, geometry });
  }

  // Place largest cells first
  blocks.sort((a, b) => 0 - Math.max(a.w, a.h) + Math.max(b.w, b.h));

  packer.fit(blocks);

  let minPoint = [Infinity, Infinity, 0];
  let maxPoint = [-Infinity, -Infinity, 0];

  for (const { geometry, fit, minZ } of blocks) {
    if (fit && fit.used) {
      const [x, y] = measureOrigin(geometry);
      const xo = 0 + xOffset + (fit.x - x + itemMargin + pageMargin);
      const yo = 0 + yOffset + (fit.y - y + itemMargin + pageMargin);
      minPoint = min([fit.x + xOffset, fit.y + yOffset, 0], minPoint);
      maxPoint = max(
        [fit.x + xOffset + fit.w, fit.y + yOffset + fit.h, 0],
        maxPoint
      );
      const transformed = toTransformedGeometry(
        translate(geometry, [xo, yo, -minZ])
      );
      packedGeometries.push(transformed);
    } else {
      unpackedGeometries.push(geometry);
    }
  }

  return [packedGeometries, unpackedGeometries, minPoint, maxPoint];
};

export default pack;
