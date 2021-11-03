import Shape from './Shape.js';
import { bend as bendGeometry } from '@jsxcad/geometry';

export const bend =
  (radius = 100) =>
  (shape) =>
    Shape.fromGeometry(bendGeometry(shape.toGeometry(), radius));

Shape.registerMethod('bend', bend);
