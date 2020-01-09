import Shape from '@jsxcad/api-v1-shape';
import { deform } from '@jsxcad/algorithm-bsp-surfaces';
import { getSolids } from '@jsxcad/geometry-tagged';
import { measureBoundingBox } from '@jsxcad/geometry-solid';
import { scale } from '@jsxcad/math-vec2';

const scaleXY = (factor, [x, y, z]) => [...scale(factor, [x, y]), z];

export const thin = (shape, widthAt = (z => 1 - z * 0.1), { resolution = 1 } = {}) => {
  const squeeze = ([x, y, z]) => scaleXY(widthAt(z), [x, y, z]);

  const assembly = [];
  for (const { solid, tags } of getSolids(shape.toKeptGeometry())) {
    const [min, max] = measureBoundingBox(solid);
    assembly.push({ solid: deform(solid, squeeze, min, max, resolution), tags });
  }

  return Shape.fromGeometry({ assembly });
};

const thinMethod = function (...args) { return thin(this, ...args); };
Shape.prototype.thin = thinMethod;

export default thin;
