import Shape from './Shape.js';
import { log as op } from '@jsxcad/geometry';

export const log = Shape.registerMethod3(
  'log',
  ['inputGeometry', 'string'],
  op
);

export default log;
