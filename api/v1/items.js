import Shape from './Shape';
import { getItems } from '@jsxcad/geometry-tagged';

export const items = (shape, xform = (_ => _)) => {
  const items = [];
  for (const solid of getItems(shape.toKeptGeometry())) {
    items.push(xform(Shape.fromGeometry(solid)));
  }
  return items;
};

const itemsMethod = function (...args) { return items(this, ...args); };
Shape.prototype.items = itemsMethod;

export default items;
