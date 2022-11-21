import { Shape } from './Shape.js';
import { fill as fillGeometry } from '@jsxcad/geometry';

export const fill = Shape.registerMethod(
  ['fill', 'f'],
  () => async (shape) =>
    Shape.fromGeometry(fillGeometry(await shape.toGeometry()))
);

export const f = fill;

export default fill;
