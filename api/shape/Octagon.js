import Shape from './Shape.js';
import { Octagon as op } from '@jsxcad/geometry';

export const Octagon = Shape.registerMethod3(
  'Octagon',
  ['intervals', 'options'],
  op
);

export default Octagon;
