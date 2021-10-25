import Shape from './Shape.js';
import { bend as bendGeometry } from '@jsxcad/geometry';

export const bend =
  (turnsPerMm = 1) =>
  (shape) =>
    Shape.fromGeometry(bendGeometry(shape.toGeometry(), turnsPerMm));

Shape.registerMethod('bend', bend);
