import Shape from './Shape.js';
import { measureArea } from '@jsxcad/geometry';

export const area = Shape.registerMethod2(
  'area',
  ['input', 'function'],
  async (input, op = (value) => (shape) => value) =>
    op(measureArea(await input.toGeometry()))(input)
);
