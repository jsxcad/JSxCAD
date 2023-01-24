import { buildCorners, computeMiddle, computeScale } from './Plan.js';
import {
  makeOcctSphere,
  makeUnitSphere as makeUnitSphereWithCgal,
} from '@jsxcad/algorithm-cgal';

import Cached from './Cached.js';
import Geometry from './Geometry.js';
import Shape from './Shape.js';
import { destructure2 } from './destructure.js';

// 1mm seems reasonable for spheres.
const DEFAULT_ORB_ZAG = 1;
const X = 0;
const Y = 1;
const Z = 2;

const makeUnitSphere = Cached('orb', (tolerance) =>
  Geometry(makeUnitSphereWithCgal(/* angularBound= */ 30, tolerance, tolerance))
);

export const Orb = Shape.registerMethod('Orb', (...args) => async (shape) => {
  const [modes, values, options] = await destructure2(
    shape,
    args,
    'modes',
    'values',
    'options'
  );
  let [x = 1, y = x, z = x] = values;
  const { zag = DEFAULT_ORB_ZAG } = options;
  const [c1, c2] = await buildCorners(x, y, z)(shape);
  const scale = computeScale(c1, c2).map((v) => v * 0.5);
  const middle = computeMiddle(c1, c2);
  const radius = Math.max(...scale);
  const tolerance = zag / radius;
  if (
    scale[X] === scale[Y] &&
    scale[Y] === scale[Z] &&
    modes.includes('occt')
  ) {
    // Occt can't handle non-uniform scaling at present.
    return Geometry(makeOcctSphere(scale[X])).move(middle);
  } else {
    return makeUnitSphere(tolerance).scale(scale).move(middle).absolute();
  }
});

export default Orb;
