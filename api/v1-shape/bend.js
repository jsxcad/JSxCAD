import Shape from './Shape.js';
import { bend as bendGeometry } from '@jsxcad/geometry';

export const bend = (shape, degreesPerMm = 1) =>
  Shape.fromGeometry(bendGeometry(shape.toGeometry(), degreesPerMm));

Shape.registerMethod('bend', bend);
