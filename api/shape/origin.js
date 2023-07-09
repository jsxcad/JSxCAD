import Shape from './Shape.js';
import { origin as op } from '@jsxcad/geometry';

export const origin = Shape.registerMethod3(
  ['origin', 'o'],
  ['inputGeometry'],
  op
);

export const o = origin;

export default origin;
