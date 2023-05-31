import Shape from './Shape.js';
import { measureVolume } from '@jsxcad/geometry';

export const volume = Shape.registerMethod2(
  'volume',
  ['input', 'function'],
  async (input, op = (value) => (shape) => value) =>
    op(measureVolume(await input.toGeometry()))(input)
);
