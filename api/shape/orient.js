import { Shape } from './Shape.js';
import { orient as op } from '@jsxcad/geometry';

export const orient = Shape.registerMethod3(
  'orient',
  ['inputGeometry', 'coordinates'],
  op
);

export default orient;
