import { containsPoint, fromSolid } from '@jsxcad/algorithm-bsp-surfaces';

import { Cube } from './Cube';
import { Shape } from './Shape';
import { assemble } from './assemble';
import { getSolids } from '@jsxcad/geometry-tagged';
import { measureBoundingBox } from '@jsxcad/geometry-solid';

const X = 0;
const Y = 1;
const Z = 2;

export const voxels = ({ resolution = 1 }, shape) => {
  const offset = resolution / 2;
  const voxels = [];
  for (const { solid, tags = [] } of getSolids(shape.toKeptGeometry())) {
    const cubes = [];
    const [min, max] = measureBoundingBox(solid);
    const bsp = fromSolid(solid);
    for (let x = min[X] + offset; x <= max[X] - offset; x += resolution) {
      for (let y = min[Y] + offset; y <= max[Y] - offset; y += resolution) {
        for (let z = min[Z] + offset; z <= max[Z] - offset; z += resolution) {
          if (containsPoint(bsp, [x, y, z])) {
            // FIX: Produce walls at transition boundaries instead of cubes.
            cubes.push(Cube(resolution).move(x, y, z));
          }
        }
      }
    }
    voxels.push(assemble(...cubes).as(...tags));
  }
  return assemble(...voxels);
};

const method = function ({ resolution = 1 } = {}) { return voxels({ resolution }, this); };

Shape.prototype.voxels = method;
