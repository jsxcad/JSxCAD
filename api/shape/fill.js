import { Shape } from './Shape.js';
import { fill as op } from '@jsxcad/geometry';

export const fill = Shape.registerMethod3(
  ['fill', 'f'],
  ['inputGeometry', 'modes:holes'],
  op
);

export const f = fill;

export default fill;
