import { Shape } from './Shape.js';
import { fill as fillGeometry } from '@jsxcad/geometry';

export const fill = Shape.registerMethod2(
  ['fill', 'f'],
  ['inputGeometry'],
  (geometry) => Shape.fromGeometry(fillGeometry(geometry))
);

export const f = fill;

export default fill;
