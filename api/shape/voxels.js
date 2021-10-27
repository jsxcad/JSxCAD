import { measureBoundingBox, withContainsPointTest } from '@jsxcad/geometry';

import { Shape } from './Shape.js';

const X = 0;
const Y = 1;
const Z = 2;

const floor = (value, resolution) =>
  Math.floor(value / resolution) * resolution;
const ceil = (value, resolution) => Math.ceil(value / resolution) * resolution;

const floorPoint = ([x, y, z], resolution) => [
  floor(x, resolution),
  floor(y, resolution),
  floor(z, resolution),
];
const ceilPoint = ([x, y, z], resolution) => [
  ceil(x, resolution),
  ceil(y, resolution),
  ceil(z, resolution),
];

export const voxels =
  (resolution = 1) =>
  (shape) => {
    const offset = resolution / 2;
    const geometry = shape.toGeometry();
    const [boxMin, boxMax] = measureBoundingBox(geometry);
    const min = floorPoint(boxMin, resolution);
    const max = ceilPoint(boxMax, resolution);
    const polygons = [];
    withContainsPointTest(geometry, (test) => {
      for (let x = min[X] - offset; x <= max[X] + offset; x += resolution) {
        for (let y = min[Y] - offset; y <= max[Y] + offset; y += resolution) {
          for (let z = min[Z] - offset; z <= max[Z] + offset; z += resolution) {
            const state = test(x, y, z);
            if (state !== test(x + resolution, y, z)) {
              const face = [
                [x + offset, y - offset, z - offset],
                [x + offset, y + offset, z - offset],
                [x + offset, y + offset, z + offset],
                [x + offset, y - offset, z + offset],
              ];
              polygons.push({ points: state ? face : face.reverse() });
            }
            if (state !== test(x, y + resolution, z)) {
              const face = [
                [x - offset, y + offset, z - offset],
                [x + offset, y + offset, z - offset],
                [x + offset, y + offset, z + offset],
                [x - offset, y + offset, z + offset],
              ];
              polygons.push({ points: state ? face.reverse() : face });
            }
            if (state !== test(x, y, z + resolution)) {
              const face = [
                [x - offset, y - offset, z + offset],
                [x + offset, y - offset, z + offset],
                [x + offset, y + offset, z + offset],
                [x - offset, y + offset, z + offset],
              ];
              polygons.push({ points: state ? face : face.reverse() });
            }
          }
        }
      }
    });
    return Shape.fromPolygons(polygons);
  };

Shape.registerMethod('voxels', voxels);
