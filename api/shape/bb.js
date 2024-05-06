import Shape from './Shape.js';
import { bb as op } from '@jsxcad/geometry';

export const bb = Shape.registerMethod3(
  ['bb', 'boundingBox'],
  ['inputGeometry', 'number', 'number', 'number'],
  op
);
