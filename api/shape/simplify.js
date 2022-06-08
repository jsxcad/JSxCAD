import Shape from './Shape.js';
import { destructure } from './destructure.js';
import { simplify as simplifyGeometry } from '@jsxcad/geometry';

export const simplify = Shape.chainable((...args) => (shape) => {
  const { object: options = {} } = destructure(args);
  const { ratio, simplifyPoints, eps } = options;
  return Shape.fromGeometry(
    simplifyGeometry(shape.toGeometry(), ratio, simplifyPoints, eps)
  );
});

Shape.registerMethod('simplify', simplify);
