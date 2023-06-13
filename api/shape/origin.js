import Point from './Point.js';
import Shape from './Shape.js';
import { getInverseMatrices } from '@jsxcad/geometry';

export const origin = Shape.registerMethod2(
  ['origin', 'o'],
  ['inputGeometry'],
  (geometry) => {
    const { local } = getInverseMatrices(geometry);
    return Point().transform(local);
  }
);

export const o = origin;

export default origin;
