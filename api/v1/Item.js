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

const toItemMethod = function (id) { return Item(this, id); };
Shape.prototype.toItem = toItemMethod;

export default Item;

Item.signature = 'Item(shape:Shape, id:string) -> Shape';
toItemMethod.signature = 'Shape -> toItem(id:string) -> Shape';
