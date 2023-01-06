import { buildCorners, computeMiddle, computeScale } from './Plan.js';

import Cached from './Cached.js';
import Shape from './Shape.js';
import { destructure2 } from './destructure.js';
import { makeUnitSphere as makeUnitSphereWithCgal } from '@jsxcad/algorithm-cgal';
import { scale as scaleOp } from './scale.js';

// 1mm seems reasonable for spheres.
const DEFAULT_ORB_ZAG = 1;

const makeUnitSphere = Cached('orb', (tolerance) =>
  Shape.fromGeometry(
    makeUnitSphereWithCgal(/* angularBound= */ 30, tolerance, tolerance)
  )
);

const reifyOrb = async ({ c1, c2, zag = DEFAULT_ORB_ZAG }) => {
  // FIX: Check what's happening with scale.
  const scale = computeScale(c1, c2).map((v) => v * 0.5);
  const middle = computeMiddle(c1, c2);
  const radius = Math.max(...scale);
  const tolerance = zag / radius;
  const unitSphere = await makeUnitSphere(tolerance);
  return scaleOp(scale).move(middle).absolute()(unitSphere);
};

export const Orb = Shape.registerMethod('Orb', (...args) => async (shape) => {
  const [values, options] = await destructure2(
    shape,
    args,
    'values',
    'options'
  );
  let [x = 1, y = x, z = x] = values;
  const { zag } = options;
  const [c1, c2] = await buildCorners(x, y, z)(shape);
  return reifyOrb({ c1, c2, zag });
});

export default Orb;
