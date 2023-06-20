import Shape from './Shape.js';
import { toDisplayGeometry as op } from '@jsxcad/geometry';

export const toDisplayGeometry = Shape.registerMethod2(
  'toDisplayGeometry',
  ['inputGeometry'],
  (geometry) => op(geometry)
);
