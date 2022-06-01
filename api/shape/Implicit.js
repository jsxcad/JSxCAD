import Shape from './Shape.js';

import { computeImplicitVolume } from '@jsxcad/geometry';
import { destructure } from './destructure.js';

export const Implicit = (...args) => {
  const {
    func: op,
    object: options = {},
    number: radius = 1,
  } = destructure(args);
  const {
    angularBound = 30,
    radiusBound = 0.1,
    distanceBound = 0.1,
    errorBound = 0.001,
  } = options;
  return Shape.fromGeometry(
    computeImplicitVolume(
      op,
      radius,
      angularBound,
      radiusBound,
      distanceBound,
      errorBound
    )
  );
};

Shape.prototype.Implicit = Shape.shapeMethod(Implicit);

export default Implicit;
