import { Shape, assemble } from '@jsxcad/api-v1-shape';
import { containsPoint, fromSolid } from '@jsxcad/algorithm-bsp-surfaces';
import { fromPolygons, measureBoundingBox } from '@jsxcad/geometry-solid';

import { getSolids } from '@jsxcad/geometry-tagged';

const X = 0;
const Y = 1;
const Z = 2;

export const voxels = (shape, resolution = 1) => {
  const offset = resolution / 2;
  const voxels = [];
  for (const { solid, tags } of getSolids(shape.toKeptGeometry())) {
    const [min, max] = measureBoundingBox(solid);
    const bsp = fromSolid(solid);
    const polygons = [];
    for (let x = min[X] - offset; x <= max[X] + offset; x += resolution) {
      for (let y = min[Y] - offset; y <= max[Y] + offset; y += resolution) {
        for (let z = min[Z] - offset; z <= max[Z] + offset; z += resolution) {
          const state = containsPoint(bsp, [x, y, z]);
          if (state !== containsPoint(bsp, [x + resolution, y, z])) {
            const face = [[x + offset, y - offset, z - offset],
                          [x + offset, y + offset, z - offset],
                          [x + offset, y + offset, z + offset],
                          [x + offset, y - offset, z + offset]];
            polygons.push(state ? face : face.reverse());
          }
          if (state !== containsPoint(bsp, [x, y + resolution, z])) {
            const face = [[x - offset, y + offset, z - offset],
                          [x + offset, y + offset, z - offset],
                          [x + offset, y + offset, z + offset],
                          [x - offset, y + offset, z + offset]];
            polygons.push(state ? face.reverse() : face);
          }
          if (state !== containsPoint(bsp, [x, y, z + resolution])) {
            const face = [[x - offset, y - offset, z + offset],
                          [x + offset, y - offset, z + offset],
                          [x + offset, y + offset, z + offset],
                          [x - offset, y + offset, z + offset]];
            polygons.push(state ? face : face.reverse());
          }
        }
      }
    }
    voxels.push(Shape.fromGeometry({ solid: fromPolygons({}, polygons), tags }));
  }
  return assemble(...voxels);
};

const vowelsMethod = function (...args) { return voxels(this, ...args); };
Shape.prototype.voxels = vowelsMethod;

export default voxels;
