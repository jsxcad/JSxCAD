import Shape from './Shape.js';
import { trim as op } from '@jsxcad/geometry';

export const Trim = Shape.registerMethod3('Trim', ['geometry', 'geometry'], op);

export const trim = Shape.registerMethod3(
  'trim',
  ['inputGeometry', 'geometry'],
  op
);
