import Shape from './Shape.js';
import { simplify as simplifyGeometry } from '@jsxcad/geometry';

export const simplify = (resolution = 100) => (shape) =>
  Shape.fromGeometry(simplifyGeometry(shape.toGeometry(), resolution));

Shape.registerMethod('simplify', simplify);
