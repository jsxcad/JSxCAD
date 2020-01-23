import { GrowingPacker, Packer } from 'bin-packing-es';
import { measureBoundingBox, toTransformedGeometry, translate } from '@jsxcad/geometry-tagged';

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

const measureOffsets = (size, pageMargin) => {
  if (size) {
    const [width, length] = size;

    // Center the output to match pages.
    const xOffset = width / -2 + pageMargin;
    const yOffset = length / -2 + pageMargin;
    const packer = new Packer(width, length);

    return [xOffset, yOffset, packer];
  } else {
    const packer = new GrowingPacker();
    return [0, 0, packer];
  }
};

export const pack = ({ size, itemMargin = 1, pageMargin = 5 }, ...geometries) => {
  const [xOffset, yOffset, packer] = measureOffsets(size, pageMargin);

  const packedGeometries = [];
  const unpackedGeometries = [];

  const blocks = [];

  for (const geometry of geometries) {
    const [width, length] = measureSize(geometry);
    const [w, h] = [width + itemMargin * 2, length + itemMargin * 2];
    blocks.push({ w, h, geometry });
  }

  blocks.sort((a, b) => b.h < a.h); // sort inputs for best results

  packer.fit(blocks);

  for (const { geometry, fit } of blocks) {
    if (fit) {
      const [x, y] = measureOrigin(geometry);
      const xo = fit.x - x + itemMargin + xOffset;
      const yo = 0 - yOffset - ((fit.y - y) + itemMargin);
      packedGeometries.push(toTransformedGeometry(translate([xo, yo, 0], geometry)));
    } else {
      unpackedGeometries.push(geometry);
    }
  }

  return [packedGeometries, unpackedGeometries];
};

export default pack;
