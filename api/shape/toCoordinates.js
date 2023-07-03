import Shape from './Shape.js';
import { toCoordinates as op } from '@jsxcad/geometry';

export const toCoordinates = Shape.registerMethod3(
  'toCoordinates',
  ['inputGeometry'],
  op,
  (result) => result
);

export default toCoordinates;
