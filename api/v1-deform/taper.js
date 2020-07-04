import { getSolids, taggedAssembly, taggedSolid } from '@jsxcad/geometry-tagged';
import { makeWatertight, measureBoundingBox } from '@jsxcad/geometry-solid';

import Shape from '@jsxcad/api-v1-shape';
import { deform } from '@jsxcad/geometry-bsp';
import { scale } from '@jsxcad/math-vec2';

const Z = 2;

const scaleXY = (factor, [x, y, z]) => [...scale(factor, [x, y]), z];

// TODO: Support different factors for x and y.
export const taper = (shape, factor, { resolution = 1 } = {}) => {
  const assembly = [];
  for (const { solid, tags } of getSolids(shape.toKeptGeometry())) {
    const [min, max] = measureBoundingBox(solid);
    const maxZ = max[Z];
    const minZ = min[Z];
    const height = maxZ - minZ;
    const widthAt = (z) => 1 - ((z - minZ) / height) * (1 - factor);
    const squeeze = ([x, y, z]) => scaleXY(widthAt(z), [x, y, z]);
    assembly.push(taggedSolid({ tags }, deform(makeWatertight(solid), squeeze, min, max, resolution)));
  }

  return Shape.fromGeometry(taggedAssembly({}, ...assembly));
};

const taperMethod = function (...args) {
  return taper(this, ...args);
};
Shape.prototype.taper = taperMethod;

export default taper;
