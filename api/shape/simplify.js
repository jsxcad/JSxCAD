import Shape from './Shape.js';
import { simplify as simplifyGeometry } from '@jsxcad/geometry';

export const simplify =
  ({ ratio = 0.25, eps } = {}) =>
  (shape) =>
    Shape.fromGeometry(simplifyGeometry(shape.toGeometry(), { ratio, eps }));

Shape.registerMethod('simplify', simplify);
