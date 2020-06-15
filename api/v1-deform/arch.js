import { makeWatertight, measureBoundingBox } from '@jsxcad/geometry-solid';

import Shape from '@jsxcad/api-v1-shape';
import { deform } from '@jsxcad/geometry-bsp';
import { getSolids } from '@jsxcad/geometry-tagged';

const Z = 2;

// TODO: Radial distortion rather than just lift?
export const arch = (shape, factor, { resolution = 1 } = {}) => {
  const assembly = [];
  for (const { solid, tags } of getSolids(shape.toKeptGeometry())) {
    const [min, max] = measureBoundingBox(solid);
    const maxZ = max[Z];
    const minZ = min[Z];
    const height = maxZ - minZ;
    const liftAt = (z) => factor * Math.sin(((z - minZ) / height) * Math.PI);
    const lift = ([x, y, z]) => [x + liftAt(z), y, z];
    assembly.push({
      solid: deform(makeWatertight(solid), lift, min, max, resolution),
      tags,
    });
  }

  return Shape.fromGeometry({ assembly });
};

const archMethod = function (...args) {
  return arch(this, ...args);
};
Shape.prototype.arch = archMethod;

export default arch;
