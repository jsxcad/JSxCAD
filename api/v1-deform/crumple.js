import { makeWatertight, measureBoundingBox } from '@jsxcad/geometry-solid';

import Shape from '@jsxcad/api-v1-shape';
import { deform } from '@jsxcad/algorithm-bsp-surfaces';
import { getSolids } from '@jsxcad/geometry-tagged';
import { makeNoise3D } from 'open-simplex-noise';

const X = 0;
const Y = 1;
const Z = 2;

export const crumple = (
  shape,
  amount = 0.1,
  { resolution = 1, seed = 1 } = {}
) => {
  const scale = amount / 2;

  const noiseX = makeNoise3D(seed + 0);
  const noiseY = makeNoise3D(seed + 1);
  const noiseZ = makeNoise3D(seed + 2);

  const perturb = (point) => [
    point[X] + noiseX(...point) * scale,
    point[Y] + noiseY(...point) * scale,
    point[Z] + noiseZ(...point) * scale,
  ];

  const assembly = [];
  for (const { solid, tags } of getSolids(shape.toKeptGeometry())) {
    const [min, max] = measureBoundingBox(solid);
    assembly.push({
      solid: deform(makeWatertight(solid), perturb, min, max, resolution),
      tags,
    });
  }

  return Shape.fromGeometry({ assembly });
};

const crumpleMethod = function (...args) {
  return crumple(this, ...args);
};
Shape.prototype.crumple = crumpleMethod;

export default crumple;
