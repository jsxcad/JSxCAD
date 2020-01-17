import Shape from '@jsxcad/api-v1-shape';

import { rewriteTags } from '@jsxcad/geometry-tagged';

/**
 *
 * # Item
 *
 * Encapsulates a geometry as a discrete item.
 *
 **/

export const Item = (shape, id) => Shape.fromGeometry(rewriteTags([`item/${id}`], [], { item: shape.toGeometry() }));

const toItemMethod = function (id) { return Item(this, id); };
Shape.prototype.Item = toItemMethod;
Shape.prototype.toItem = toItemMethod;

Item.signature = 'Item(shape:Shape, id:string) -> Shape';
toItemMethod.signature = 'Shape -> toItem(id:string) -> Shape';

export default Item;
