import { fromDesignator, registerDesignator } from './designator';
import { rewriteTags, toKeptGeometry } from '@jsxcad/geometry-tagged';

import { Connector } from '@jsxcad/api-v1-connector';
import Shape from '@jsxcad/api-v1-shape';

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
  const shape = Shape.fromGeometry(toKeptGeometry(rewriteTags([`item/${id}`], [], { item: this.toGeometry() })))
      .with(Connector('center'));
  // Register the designator for re-use.
  registerDesignator(d => (d === id), () => shape);
  return shape;
};

Shape.prototype.Item = itemMethod;
Shape.prototype.toItem = itemMethod;

Item.signature = 'Item(shape:Shape, id:string) -> Shape';
itemMethod.signature = 'Shape -> toItem(id:string) -> Shape';

export default Item;
