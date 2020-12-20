import Shape from './Shape.js';
import { getLeafs } from '@jsxcad/geometry-tagged';

export const each = (shape, op = (x) => x) =>
  getLeafs(shape.toDisjointGeometry()).map((leaf) =>
    op(Shape.fromGeometry(leaf))
  );

const eachMethod = function (op) {
  return each(this, op);
};

Shape.prototype.each = eachMethod;

export default each;
