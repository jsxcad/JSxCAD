import { measureBoundingBox, rotateZ, toTransformedGeometry, translate } from '@jsxcad/geometry-tagged';

import { BP2D } from 'binpackingjs';

// const { BP2D } = BinPacking;
const { Bin, Box, Packer } = BP2D;

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

export const pack = ({ size = [210, 297], margin = 5 }, ...geometries) => {
  // Center the output to match pages.
  const xOffset = size[X] / -2;
  const yOffset = size[Y] / -2;
  const bin = new Bin(...size);
  const packer = new Packer([bin]);
  const boxes = [];
  for (const geometry of geometries) {
    const [width, height] = measureSize(geometry);
    const box = new Box(width + margin * 2, height + margin * 2);
    box.geometry = geometry;
    box.originalWidth = box.width;
    box.originalHeight = box.height;
    box.geometryWidth = width;
    box.geometryHeight = height;
    boxes.push(box);
  }
  const isPackedGeometry = new Set();
  const packedGeometries = [];
  for (const box of packer.pack(boxes)) {
    let geometry = box.geometry;
    isPackedGeometry.add(geometry);
    if (box.width !== box.originalWidth) {
      geometry = rotateZ(90, geometry);
    }
    const [x, y] = measureOrigin(geometry);
    geometry = toTransformedGeometry(translate([box.x - x + margin + xOffset, box.y - y + margin + yOffset, 0], geometry));
    packedGeometries.push(geometry);
  }
  const unpackedGeometries = geometries.filter(geometry => !isPackedGeometry.has(geometry));
  return [packedGeometries, unpackedGeometries];
};

export default pack;
