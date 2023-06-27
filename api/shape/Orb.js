import { buildCorners, computeMiddle, computeScale } from './Plan.js';
import {
  makeOcctSphere,
  makeUnitSphere as makeUnitSphereWithCgal,
} from '@jsxcad/algorithm-cgal';

import Cached from './Cached.js';
import Geometry from './Geometry.js';
import Shape from './Shape.js';

// 1mm seems reasonable for spheres.
const DEFAULT_ORB_ZAG = 1;
const X = 0;
const Y = 1;
const Z = 2;

const makeUnitSphere = Cached('orb', (tolerance) =>
  Geometry(makeUnitSphereWithCgal(/* angularBound= */ 30, tolerance, tolerance))
);

export const Orb = Shape.registerMethod2(
  'Orb',
  ['input', 'modes:occt', 'intervals', 'options'],
  async (
    input,
    { occt },
    [x = 1, y = x, z = x],
    { zag = DEFAULT_ORB_ZAG } = {}
  ) => {
    const [c1, c2] = await buildCorners(x, y, z)(input);
    const scale = computeScale(c1, c2).map((v) => v * 0.5);
    const middle = computeMiddle(c1, c2);
    const radius = Math.max(...scale);
    const tolerance = zag / radius;
    if (scale[X] === scale[Y] && scale[Y] === scale[Z] && occt) {
      // Occt can't handle non-uniform scaling at present.
      return Geometry(makeOcctSphere(scale[X])).move(middle);
    } else {
      return makeUnitSphere(tolerance).scale(scale).move(middle).absolute();
    }
  }
);

export default Orb;
