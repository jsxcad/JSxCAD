import { Shape } from './Shape.js';
import { fill as fillGeometry } from '@jsxcad/geometry';

export const fill = Shape.chainable(
  () => (shape) => Shape.fromGeometry(fillGeometry(shape.toGeometry()))
);

export const f = fill;

Shape.registerMethod('fill', fill);
Shape.registerMethod('f', f);

export default fill;
