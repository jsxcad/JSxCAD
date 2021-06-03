import Shape from '@jsxcad/api-v1-shape';
import { getLeafs } from '@jsxcad/geometry';

export const leafs = (shape, op = (_) => _) => {
  const leafs = [];
  for (const leaf of getLeafs(shape.toKeptGeometry())) {
    leafs.push(op(Shape.fromGeometry(leaf)));
  }
  return leafs;
};

const leafsMethod = function (...args) {
  return leafs(this, ...args);
};
Shape.prototype.leafs = leafsMethod;

export default leafs;
