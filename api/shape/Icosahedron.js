import Shape from './Shape.js';
import { Icosahedron as op } from '@jsxcad/geometry';

export const Icosahedron = Shape.registerMethod3(
  'Icosahedron',
  ['intervals'],
  op
);
