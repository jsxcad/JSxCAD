import Shape from './Shape.js';
import { offset as op } from '@jsxcad/geometry';

export const offset = Shape.registerMethod3(
  'offset',
  ['inputGeometry', 'number', 'options'],
  op
);

export default offset;
