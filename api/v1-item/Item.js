import { fromDesignator, registerDesignator } from './designator.js';
import {
  rewriteTags,
  taggedItem,
  toKeptGeometry,
} from '@jsxcad/geometry-tagged';

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
  const shape = Shape.fromGeometry(
    toKeptGeometry(
      rewriteTags([`item/${id}`], [], taggedItem({}, this.toGeometry()))
    )
  ).with(Connector('center'));
  // Register the designator for re-use.
  registerDesignator(
    (d) => d === id,
    () => shape
  );
  return shape;
};

Shape.prototype.Item = itemMethod;
Shape.prototype.toItem = itemMethod;

export default Item;
