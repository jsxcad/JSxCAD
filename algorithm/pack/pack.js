import { measureBoundingBox, toTransformedGeometry, translate } from '@jsxcad/geometry-tagged';

import { MaxRectBinPack } from 'bin-packing-core';

const DO_NOT_ALLOW_ROTATE = false;
const SHORT_SIDE_FIT = 0;

const X = 0;
const Y = 1;

const measureSize = (geometry) => {
  const [min, max] = measureBoundingBox(geometry);
  const width = max[X] - min[X];
  const height = max[Y] - min[Y];
  return [width, height];
};

const measureOrigin = (geometry) => {
  const [min] = measureBoundingBox(geometry);
  const [x, y] = min;
  return [x, y];
};

export const pack = ({ size = [210, 297], margin = 1 }, ...geometries) => {
  // Center the output to match pages.
  const xOffset = size[X] / -2;
  const yOffset = size[Y] / -2;

  const packedGeometries = [];
  const unpackedGeometries = [];

  const packer = new MaxRectBinPack(size[0], size[1], DO_NOT_ALLOW_ROTATE);

  for (const geometry of geometries) {
    const [width, height] = measureSize(geometry);
    const [boxWidth, boxHeight] = [width + margin * 2, height + margin * 2];
    const result = packer.insert(boxWidth, boxHeight, SHORT_SIDE_FIT);
    if (result.width === 0 && result.height === 0) {
      unpackedGeometries.push(geometry);
    } else {
      const [x, y] = measureOrigin(geometry);
      const transformed = toTransformedGeometry(translate([result.x - x + margin + xOffset, 0 - yOffset - ((result.y - y) + margin), 0], geometry));
      packedGeometries.push(transformed);
    }
  }

  return [packedGeometries, unpackedGeometries];
};

export default pack;
