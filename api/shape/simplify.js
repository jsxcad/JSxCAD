import Shape from './Shape.js';
import { destructure } from './destructure.js';
import { simplify as simplifyGeometry } from '@jsxcad/geometry';

export const simplify = Shape.registerMethod(
  'simplify',
  (...args) =>
    async (shape) => {
      const { object: options = {}, number: eps } = destructure(args);
      const { ratio = 1.0 } = options;
      return Shape.fromGeometry(
        simplifyGeometry(await shape.toGeometry(), ratio, eps)
      );
    }
);
