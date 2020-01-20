import Shape from '@jsxcad/api-v1-shape';

import { fromDesignator } from './designator';
import { rewriteTags } from '@jsxcad/geometry-tagged';

/**
 *
 * # Item
 *
 * Encapsulates a geometry as a discrete item.
 *
 **/

// Constructs an item from the designator.
export const Item = (designator) => {
  if (typeof designator === 'string') {
    return fromDesignator(designator);
  } else if (designator instanceof Array) {
    return fromDesignator(...designator);
  }
};

// Turns the current shape into an item.
const itemMethod = function (id) {
  return Shape.fromGeometry(rewriteTags([`item/${id}`], [], { item: this.toGeometry() }));
};

Shape.prototype.Item = itemMethod;
Shape.prototype.toItem = itemMethod;

Item.signature = 'Item(shape:Shape, id:string) -> Shape';
itemMethod.signature = 'Shape -> toItem(id:string) -> Shape';

export default Item;
