import Shape from './Shape.js';
import { Hershey as op } from '@jsxcad/geometry';

export const Hershey = Shape.registerMethod3(
  'Hershey',
  ['string', 'number'],
  op
);
