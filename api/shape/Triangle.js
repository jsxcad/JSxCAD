import Shape from './Shape.js';
import { Triangle as op } from '@jsxcad/geometry';

export const Triangle = Shape.registerMethod3(
  'Triangle',
  ['intervals', 'options'],
  op
);

export default Triangle;
