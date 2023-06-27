import Shape from './Shape.js';
import { toDisplayGeometry as op } from '@jsxcad/geometry';

export const toDisplayGeometry = Shape.registerMethod3(
  'toDisplayGeometry',
  ['inputGeometry'],
  op,
  (geometry) => geometry
);
