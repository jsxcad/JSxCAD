import { buildCorners, getScale, getZag } from './Plan.js';

import Cached from './Cached.js';
import Shape from './Shape.js';
import { makeUnitSphere as makeUnitSphereWithCgal } from '@jsxcad/algorithm-cgal';
import { taggedPlan } from '@jsxcad/geometry';

// 1mm seems reasonable for spheres.
const DEFAULT_ORB_ZAG = 1;

const makeUnitSphere = Cached('orb', (tolerance) =>
  Shape.fromGeometry(
    makeUnitSphereWithCgal(/* angularBound= */ 30, tolerance, tolerance)
  )
);

Shape.registerReifier('Orb', (plan) => {
  const [scale, middle] = getScale(plan.toGeometry());
  const radius = Math.max(...scale);

  // const angularBound = 30;
  // const radiusBound = getZag(plan.toGeometry(), DEFAULT_ORB_ZAG) / radius;
  // const distanceBound = getZag(plan.toGeometry(), DEFAULT_ORB_ZAG) / radius;
  const tolerance = getZag(plan.toGeometry(), DEFAULT_ORB_ZAG) / radius;

  return makeUnitSphere(tolerance).scale(scale).move(middle).absolute();
});

export const Orb = (x = 1, y = x, z = x) => {
  const [c1, c2] = buildCorners(x, y, z);
  return Shape.fromGeometry(taggedPlan({}, { type: 'Orb' }))
    .hasC1(...c1)
    .hasC2(...c2);
};

Shape.prototype.Orb = Shape.shapeMethod(Orb);

export default Orb;
