import Shape from './Shape.js';
import { twist as twistGeometry } from '@jsxcad/geometry';

export const twist = Shape.registerMethod2(
  'twist',
  ['input', 'number'],
  (input, turnsPerMm = 1) =>
    Shape.fromGeometry(twistGeometry(input.toGeometry(), turnsPerMm))
);
