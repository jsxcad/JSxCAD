import { Shape, toGeometry } from './Shape';

import { rewriteTags } from '@jsxcad/geometry-tagged';

/**
 *
 * # Item
 *
 * Encapsulates a geometry as a discrete item.
 *
 **/

export const Item = (shape, id) => Shape.fromGeometry(rewriteTags([`item/${id}`], [], { item: toGeometry(shape) }));

const method = function (id) { return Item(this, id); };
Shape.prototype.toItem = method;

export default Item;
