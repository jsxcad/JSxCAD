import { measureBoundingBox, toTransformedGeometry, translate } from '@jsxcad/geometry-tagged';

import { Packer } from 'bin-packing-es';

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
  const [width, length] = size;

  // Center the output to match pages.
  const xOffset = width / -2;
  const yOffset = length / -2;

  const packedGeometries = [];
  const unpackedGeometries = [];

  const packer = new Packer(width, length);
  const blocks = [];

  for (const geometry of geometries) {
    const [width, length] = measureSize(geometry);
    const [w, h] = [width + margin * 2, length + margin * 2];
    blocks.push({ w, h, geometry });
  }

  blocks.sort((a, b) => b.h < a.h); // sort inputs for best results

  packer.fit(blocks);

  for (const { geometry, fit } of blocks) {
    if (fit) {
      const [x, y] = measureOrigin(geometry);
      const xo = fit.x - x + margin + xOffset;
      const yo = 0 - yOffset - ((fit.y - y) + margin);
      packedGeometries.push(toTransformedGeometry(translate([xo, yo, 0], geometry)));
    } else {
      unpackedGeometries.push(geometry);
    }
  }

  return [packedGeometries, unpackedGeometries];
};

export default pack;
