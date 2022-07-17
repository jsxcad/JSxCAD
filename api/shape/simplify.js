import Shape from './Shape.js';
import { destructure } from './destructure.js';
import { simplify as simplifyGeometry } from '@jsxcad/geometry';

export const simplify = Shape.chainable((...args) => (shape) => {
  const { object: options = {}, number: eps } = destructure(args);
  const { ratio = 1.0 } = options;
  return Shape.fromGeometry(simplifyGeometry(shape.toGeometry(), ratio, eps));
});

Shape.registerMethod('simplify', simplify);
