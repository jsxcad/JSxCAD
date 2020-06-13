import { makeWatertight, measureBoundingBox } from '@jsxcad/geometry-solid';

import Shape from '@jsxcad/api-v1-shape';
import { deform } from '@jsxcad/algorithm-bsp-surfaces';
import { getSolids } from '@jsxcad/geometry-tagged';

const Z = 0;

export const skew = (shape, factor, { resolution = 1 } = {}) => {
  const assembly = [];
  for (const { solid, tags } of getSolids(shape.toKeptGeometry())) {
    const [min, max] = measureBoundingBox(solid);
    const maxZ = max[Z];
    const minZ = min[Z];
    const height = maxZ - minZ;
    const shiftAt = (z) => 1 - ((z - minZ) / height) * (1 - factor);
    const shift = ([x, y, z]) => [x + shiftAt(z), y + shiftAt(z), z];
    assembly.push({
      solid: deform(makeWatertight(solid), shift, min, max, resolution),
      tags,
    });
  }

  return Shape.fromGeometry({ assembly });
};

const skewMethod = function (...args) {
  return skew(this, ...args);
};
Shape.prototype.skew = skewMethod;

export default skew;
