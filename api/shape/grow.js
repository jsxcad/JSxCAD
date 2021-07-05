import Shape from './Shape.js';
import { grow as growGeometry } from '@jsxcad/geometry';

export const grow = (amount) => (shape) =>
  Shape.fromGeometry(growGeometry(shape.toGeometry(), amount));

Shape.registerMethod('grow', grow);
