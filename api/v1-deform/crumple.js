import { getSolids, taggedAssembly, taggedSolid } from '@jsxcad/geometry-tagged';
import { makeWatertight, measureBoundingBox } from '@jsxcad/geometry-solid';

import OpenSimplexNoise from 'open-simplex-noise';
import Shape from '@jsxcad/api-v1-shape';
import { deform } from '@jsxcad/geometry-bsp';

const X = 0;
const Y = 1;
const Z = 2;

export const crumple = (
  shape,
  amount = 0.1,
  { resolution = 1, seed = 1 } = {}
) => {
  const scale = amount / 2;

  const noiseX = OpenSimplexNoise.makeNoise3D(seed + 0);
  const noiseY = OpenSimplexNoise.makeNoise3D(seed + 1);
  const noiseZ = OpenSimplexNoise.makeNoise3D(seed + 2);

  const perturb = (point) => [
    point[X] + noiseX(...point) * scale,
    point[Y] + noiseY(...point) * scale,
    point[Z] + noiseZ(...point) * scale,
  ];

  const assembly = [];
  for (const { solid, tags } of getSolids(shape.toKeptGeometry())) {
    const [min, max] = measureBoundingBox(solid);
    assembly.push(taggedSolid({ tags }, deform(makeWatertight(solid), perturb, min, max, resolution)));
  }

  return Shape.fromGeometry(taggedAssembly({}, ...assembly));
};

const crumpleMethod = function (...args) {
  return crumple(this, ...args);
};
Shape.prototype.crumple = crumpleMethod;

export default crumple;
