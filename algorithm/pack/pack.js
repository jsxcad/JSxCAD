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

export const pack = ({ size = [210, 297], itemMargin = 1, pageMargin = 5 }, ...geometries) => {
  // Center the output to match pages.
  const xOffset = size[X] / -2 + pageMargin;
  const yOffset = size[Y] / -2 + pageMargin;

  const packedGeometries = [];
  const unpackedGeometries = [];

  const packer = new MaxRectBinPack(size[0] - pageMargin * 2, size[1] - pageMargin * 2, DO_NOT_ALLOW_ROTATE);

  for (const geometry of geometries) {
    const [width, height] = measureSize(geometry);
    const [boxWidth, boxHeight] = [width + itemMargin * 2, height + itemMargin * 2];
    const result = packer.insert(boxWidth, boxHeight, SHORT_SIDE_FIT);
    if (result.width === 0 && result.height === 0) {
      unpackedGeometries.push(geometry);
    } else {
      const [x, y] = measureOrigin(geometry);
      const transformed = toTransformedGeometry(translate([result.x - x + itemMargin + xOffset, 0 - yOffset - ((result.y - y) + itemMargin), 0], geometry));
      packedGeometries.push(transformed);
    }
  }

  return [packedGeometries, unpackedGeometries];
};

export default pack;
