import { Shape } from './Shape.js';
import { fill as fillGeometry } from '@jsxcad/geometry';

export const fill = Shape.registerMethod(['fill', 'f'],
  () => (shape) => Shape.fromGeometry(fillGeometry(shape.toGeometry()))
);

export const f = fill;

export default fill;
