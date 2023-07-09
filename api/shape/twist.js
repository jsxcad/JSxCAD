import Shape from './Shape.js';
import { twist as op } from '@jsxcad/geometry';

export const twist = Shape.registerMethod3(
  'twist',
  ['inputGeometry', 'number'],
  op
);
