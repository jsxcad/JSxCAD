import Shape from './Shape.js';
import { pack as op } from '@jsxcad/geometry';

export const pack = Shape.registerMethod3(
  'pack',
  ['inputGeometry', 'geometries', 'numbers', 'options', 'string'],
  op
);

export default pack;
