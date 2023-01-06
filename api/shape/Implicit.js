import Shape from './Shape.js';

import { computeImplicitVolume } from '@jsxcad/geometry';
import { destructure2 } from './destructure.js';

export const Implicit = Shape.registerMethod(
  'Implicit',
  (...args) =>
    async (shape) => {
      const [radius = 1, op, options] = await destructure2(
        shape,
        args,
        'number',
        'function',
        'options'
      );
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
    }
);

export default Implicit;
