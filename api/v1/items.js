import Shape from './Shape';
import { getItems } from '@jsxcad/geometry-tagged';

export const items = (shape, op = (_ => _)) => {
  const items = [];
  for (const solid of getItems(shape.toKeptGeometry())) {
    items.push(op(Shape.fromGeometry(solid)));
  }
  return items;
};

const itemsMethod = function (...args) { return items(this, ...args); };
Shape.prototype.items = itemsMethod;

export default items;

items.signature = 'items(shape:Shape, op:function) -> Shapes';
itemsMethod.signature = 'Shape -> items(op:function) -> Shapes';
