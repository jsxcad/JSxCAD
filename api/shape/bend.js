import Shape from './Shape.js';
import { bend as bendGeometry } from '@jsxcad/geometry';

export const bend = Shape.chainable(
  (radius = 100) =>
    (shape) =>
      Shape.fromGeometry(bendGeometry(shape.toGeometry(), radius))
);

Shape.registerMethod('bend', bend);
