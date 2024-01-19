import Shape from './Shape.js';
import { Hexagon as op } from '@jsxcad/geometry';

export const Hexagon = Shape.registerMethod3(
  'Hexagon',
  ['intervals', 'options'],
  op
);

export default Hexagon;
