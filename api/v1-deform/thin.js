import { makeWatertight, measureBoundingBox } from '@jsxcad/geometry-solid';

import Shape from '@jsxcad/api-v1-shape';
import { deform } from '@jsxcad/algorithm-bsp-surfaces';
import { getSolids } from '@jsxcad/geometry-tagged';
import { scale } from '@jsxcad/math-vec2';

const Z = 2;

const scaleXY = (factor, [x, y, z]) => [...scale(factor, [x, y]), z];

export const thin = (shape, factor, { resolution = 1 } = {}) => {
  const assembly = [];
  for (const { solid, tags } of getSolids(shape.toKeptGeometry())) {
    const [min, max] = measureBoundingBox(solid);
    const maxZ = max[Z];
    const minZ = min[Z];
    const height = maxZ - minZ;
    const widthAt = z => 1 - (z - minZ) / height * (1 - factor);
    const squeeze = ([x, y, z]) => scaleXY(widthAt(z), [x, y, z]);
    assembly.push({ solid: deform(makeWatertight(solid), squeeze, min, max, resolution), tags });
  }

  return Shape.fromGeometry({ assembly });
};

const thinMethod = function (...args) { return thin(this, ...args); };
Shape.prototype.thin = thinMethod;

export default thin;
