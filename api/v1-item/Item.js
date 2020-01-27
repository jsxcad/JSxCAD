import { fromDesignator, registerDesignator } from './designator';

import Shape from '@jsxcad/api-v1-shape';
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
  const shape = Shape.fromGeometry(rewriteTags([`item/${id}`], [], { item: this.toGeometry() }));
  // Register the designator for re-use.
  registerDesignator(d => (d === id), () => shape);
  return shape;
};

Shape.prototype.Item = itemMethod;
Shape.prototype.toItem = itemMethod;

Item.signature = 'Item(shape:Shape, id:string) -> Shape';
itemMethod.signature = 'Shape -> toItem(id:string) -> Shape';

export default Item;
