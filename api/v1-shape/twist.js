import Shape from './Shape.js';
import { twist as twistGeometry } from '@jsxcad/geometry';

export const twist =
  (degreesPerMm = 1) =>
  (shape) =>
    Shape.fromGeometry(twistGeometry(shape.toGeometry(), degreesPerMm));

Shape.registerMethod('twist', twist);
