import { Random } from '@jsxcad/api-v1-math';
import Shape from '@jsxcad/api-v1-shape';
import { deform } from '@jsxcad/algorithm-bsp-surfaces';
import { getSolids } from '@jsxcad/geometry-tagged';
import { measureBoundingBox } from '@jsxcad/geometry-solid';

export const crumple = (shape, amount = 0.1, { resolution = 1, rng = Random() } = {}) => {
  const offset = v => v + (rng() - 0.5) * amount * 2;
  const perturb = ([x, y, z]) => [offset(x), offset(y), offset(z)];

  const assembly = [];
  for (const { solid, tags } of getSolids(shape.toKeptGeometry())) {
    const [min, max] = measureBoundingBox(solid);
    assembly.push({ solid: deform(solid, perturb, min, max, resolution), tags });
  }

  return Shape.fromGeometry({ assembly });
};

const crumpleMethod = function (...args) { return crumple(this, ...args); };
Shape.prototype.crumple = crumpleMethod;

export default crumple;
