import { containsPoint, fromSolid } from '@jsxcad/algorithm-bsp-surfaces';

import { Shape } from './Shape';
import { assemble } from './assemble';
import { cube } from './cube';
import { getSolids } from '@jsxcad/geometry-tagged';
import { measureBoundingBox } from '@jsxcad/geometry-solid';

const X = 0;
const Y = 1;
const Z = 2;

export const voxels = ({ resolution = 1 }, shape) => {
  const voxels = [];
  for (const { solid, tags } of getSolids(shape.toKeptGeometry())) {
    const [min, max] = measureBoundingBox(solid);
console.log(`QQ/bounds: ${max} ${min}`);
    const bsp = fromSolid(solid);
    for (let x = min[X]; x <= max[X]; x += resolution) {
      for (let y = min[Y]; y <= max[Y]; y += resolution) {
        for (let z = min[Z]; z <= max[Z]; z += resolution) {
console.log(`QQ/point: ${[x, y, z]}`);
          if (containsPoint(bsp, [x, y, z])) {
console.log(`QQ/point/in`);
            voxels.push(cube(resolution).move(x, y, z));
          } else {
console.log(`QQ/point/out`);
          }
        }
      }
    }
  }
  return assemble(...voxels);
}

const method = function ({ resolution = 1 } = {}) { return voxels({ resolution }, this); }

Shape.prototype.voxels = method;
