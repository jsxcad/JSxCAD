import Shape from '@jsxcad/api-v1-shape';
import { getItems } from '@jsxcad/geometry-tagged';

export const items = (shape, op = (_ => _)) => {
  const items = [];
  for (const item of getItems(shape.toKeptGeometry())) {
    items.push(op(Shape.fromGeometry(item)));
  }
  return items;
};

const itemsMethod = function (...args) { return items(this, ...args); };
Shape.prototype.items = itemsMethod;

items.signature = 'items(shape:Shape, op:function) -> Shapes';
itemsMethod.signature = 'Shape -> items(op:function) -> Shapes';

export default items;
