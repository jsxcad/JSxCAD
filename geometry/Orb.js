import { buildCorners, computeMiddle, computeScale } from './corners.js';

import { makeAbsolute } from './makeAbsolute.js';
import { makeUnitSphere as makeUnitSphereWithCgal } from '@jsxcad/algorithm-cgal';
import { scale as scaleGeometry } from './scale.js';
import { scale as scaleVector } from './vector.js';
import { translate } from './translate.js';

// 1mm seems reasonable for spheres.
const DEFAULT_ORB_ZAG = 1;

export const Orb = ([x = 1, y = x, z = x], { zag = DEFAULT_ORB_ZAG } = {}) => {
  const [c1, c2] = buildCorners(x, y, z);
  const scale = scaleVector(0.5, computeScale(c1, c2));
  const middle = computeMiddle(c1, c2);
  const radius = Math.max(...scale);
  const tolerance = zag / radius;
  const unitSphere = makeUnitSphereWithCgal(
    /* angularBound= */ 30,
    tolerance,
    tolerance
  );
  return makeAbsolute(translate(scaleGeometry(unitSphere, scale), middle));
};
