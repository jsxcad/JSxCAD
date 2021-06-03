import { taggedAssembly, taggedItem } from '@jsxcad/geometry';

import Shape from '@jsxcad/api-v1-shape';

// Constructs an item from the designator.
export const Item = (id = '', ...shapes) =>
  Shape.fromGeometry(
    taggedItem(
      { tags: [`item/${id}`] },
      taggedAssembly({}, ...shapes.map((shape) => shape.toGeometry()))
    )
  );

// Turns the current shape into an item.
const itemMethod = function (id) {
  return Item(id, this);
};

Shape.prototype.item = itemMethod;

export default Item;
