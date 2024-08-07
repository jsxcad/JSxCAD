import Shape from './Shape.js';

import { computeImplicitVolume } from '@jsxcad/geometry';

export const Implicit = Shape.registerMethod3(
  'Implicit',
  ['number', 'function', 'options'],
  (
    radius = 1,
    op,
    {
      angularBound = 30,
      radiusBound = 0.1,
      distanceBound = 0.1,
      errorBound = 0.001,
    } = {}
  ) =>
    computeImplicitVolume(
      op,
      radius,
      angularBound,
      radiusBound,
      distanceBound,
      errorBound
    )
);

export default Implicit;
