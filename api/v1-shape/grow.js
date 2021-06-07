import Shape from './Shape.js';
import { grow as growGeometry } from '@jsxcad/geometry';

export const grow = (shape, amount) =>
  Shape.fromGeometry(growGeometry(shape.toGeometry(), amount));

Shape.registerMethod('grow', grow);
