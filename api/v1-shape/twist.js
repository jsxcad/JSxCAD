import Shape from './Shape.js';
import { twist as twistGeometry } from '@jsxcad/geometry';

export const twist = (shape, degreesPerMm = 1) =>
  Shape.fromGeometry(twistGeometry(shape.toGeometry(), degreesPerMm));

Shape.registerMethod('twist', twist);
