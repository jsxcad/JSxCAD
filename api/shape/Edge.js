import Shape from './Shape.js';
import { Edge as op } from '@jsxcad/geometry';

export const Edge = Shape.registerMethod3(
  'Edge',
  ['coordinate', 'coordinate', 'coordinate'],
  op
);

export default Edge;
