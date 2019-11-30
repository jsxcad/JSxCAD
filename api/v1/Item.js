import { Shape, toGeometry } from './Shape';
import { addTags } from '@jsxcad/geometry-tagged';

/**
 *
 * # Item
 *
 * Encapsulates a geometry as a discrete item.
 *
 **/

export const Item = (shape, id) => Shape.fromGeometry(addTags([`item/${id}`], { item: toGeometry(shape) }));

const method = function (id) { return Item(this, id); };
Shape.prototype.toItem = method;

export default Item;
