import Point from './Point.js';
import Shape from './Shape.js';
import { getInverseMatrices } from '@jsxcad/geometry';

export const origin = () => (shape) => {
  const { local } = getInverseMatrices(shape.toGeometry());
  return Point().transform(local);
};

export const o = origin;

Shape.registerMethod('origin', origin);
Shape.registerMethod('o', o);

export default origin;
