import Point from './Point.js';
import Shape from './Shape.js';
import { getInverseMatrices } from '@jsxcad/geometry';

export const origin = Shape.registerMethod(
  ['origin', 'o'],
  () => async (shape) => {
    const { local } = getInverseMatrices(await shape.toGeometry());
    return Point().transform(local);
  }
);

export const o = origin;

export default origin;
