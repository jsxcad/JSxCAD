import Shape from '@jsxcad/api-v1-shape';
import { getLeafs } from '@jsxcad/geometry-tagged';

export const leafs = (shape, op = (_ => _)) => {
  const leafs = [];
  for (const leaf of getLeafs(shape.toKeptGeometry())) {
    leafs.push(op(Shape.fromGeometry(leaf)));
  }
  return leafs;
};

const leafsMethod = function (...args) { return leafs(this, ...args); };
Shape.prototype.leafs = leafsMethod;

leafs.signature = 'leafs(shape:Shape, op:function) -> Shapes';
leafsMethod.signature = 'Shape -> leafs(op:function) -> Shapes';

export default leafs;
