import Shape from './Shape.js';
import { getLeafs } from '@jsxcad/geometry';

export const each = (shape, op = (leafs, shape) => leafs) =>
  op(
    getLeafs(shape.toDisjointGeometry()).map((leaf) =>
      Shape.fromGeometry(leaf)
    ),
    shape
  );

const eachMethod = function (op) {
  return each(this, op);
};

Shape.prototype.each = eachMethod;

export default each;
