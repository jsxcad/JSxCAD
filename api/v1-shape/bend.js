import Shape from './Shape.js';
import { bend as bendGeometry } from '@jsxcad/geometry';

export const bend =
  (degreesPerMm = 1) =>
  (shape) =>
    Shape.fromGeometry(bendGeometry(shape.toGeometry(), degreesPerMm));

Shape.registerMethod('bend', bend);
