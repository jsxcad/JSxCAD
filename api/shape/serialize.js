import Shape from './Shape.js';
import { serialize as serializeGeometry } from '@jsxcad/geometry';

export const serialize = Shape.registerMethod2(
  'serialize',
  ['input', 'function'],
  async (input, op = (v) => v, groupOp = (_v) => (s) => s) =>
    groupOp(op(serializeGeometry(await input.toGeometry())))(input)
);
