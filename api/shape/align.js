import Shape from './Shape.js';
import { align as op } from '@jsxcad/geometry';

export const align = Shape.registerMethod3(
  'align',
  ['inputGeometry', 'string', 'coordinate'],
  op
);

export default align;
