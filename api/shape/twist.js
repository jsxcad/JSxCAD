import Shape from './Shape.js';
import { twist as twistGeometry } from '@jsxcad/geometry';

export const twist = Shape.registerMethod(
  'twist',
  (turnsPerMm = 1) =>
    (shape) =>
      Shape.fromGeometry(twistGeometry(shape.toGeometry(), turnsPerMm))
);
