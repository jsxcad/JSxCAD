import Shape from './Shape.js';
import { offset as offsetGeometry } from '@jsxcad/geometry';

export const offset = (shape, initial = 1, step, limit) =>
  Shape.fromGeometry(offsetGeometry(shape.toGeometry(), initial, step, limit));

const offsetMethod = function (initial, step, limit) {
  return offset(this, initial, step, limit);
};

Shape.prototype.offset = offsetMethod;

export default offset;
