import Shape from './Shape.js';
import { involute as involuteGeometry } from '@jsxcad/geometry';

export const involute = Shape.registerMethod2(
  'involute',
  ['inputGeometry'],
  (geometry) => Shape.fromGeometry(involuteGeometry(geometry))
);
