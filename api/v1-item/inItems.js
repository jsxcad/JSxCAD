import { rewrite, update } from '@jsxcad/geometry';

import Shape from '@jsxcad/api-v1-shape';

export const inItems = (shape, op = (_) => _) => {
  const rewritten = rewrite(shape.toKeptGeometry(), (geometry, descend) => {
    if (geometry.item) {
      // Operate on the interior of the items.
      const item = op(Shape.fromGeometry(geometry.item));
      // Reassemble as an item equivalent to the original.
      return update(geometry, { item: item.toGeometry() });
    } else {
      return descend();
    }
  });
  return Shape.fromGeometry(rewritten);
};

const inItemsMethod = function (...args) {
  return inItems(this, ...args);
};
Shape.prototype.inItems = inItemsMethod;

inItems.signature = 'inItems(shape:Shape, op:function) -> Shapes';
inItemsMethod.signature = 'Shape -> inItems(op:function) -> Shapes';

export default inItems;
