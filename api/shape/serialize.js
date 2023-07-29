import Shape from './Shape.js';
import { serialize as serializeGeometry } from '@jsxcad/geometry';

export const serialize = Shape.registerMethod3(
  'serialize',
  ['inputGeometry', 'function'],
  (geometry, op = (v) => v) =>
    Shape.applyToGeometry(serializeGeometry(geometry), op)
);
