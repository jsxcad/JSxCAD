import Shape from './Shape.js';
import { Pentagon as op } from '@jsxcad/geometry';

export const Pentagon = Shape.registerMethod3(
  'Pentagon',
  ['intervals', 'options'],
  op
);

export default Pentagon;
