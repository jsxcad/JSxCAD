import Shape$1, { Shape, toGeometry } from './jsxcad-api-v1-shape.js';
import { rewriteTags, getItems } from './jsxcad-geometry-tagged.js';

/**
 *
 * # Item
 *
 * Encapsulates a geometry as a discrete item.
 *
 **/

const Item = (shape, id) => Shape.fromGeometry(rewriteTags([`item/${id}`], [], { item: toGeometry(shape) }));

const toItemMethod = function (id) { return Item(this, id); };
Shape.prototype.toItem = toItemMethod;

Item.signature = 'Item(shape:Shape, id:string) -> Shape';
toItemMethod.signature = 'Shape -> toItem(id:string) -> Shape';

/**
 *
 * # Bill Of Materials
 *
 **/

const bom = (shape, ...args) => '';

const bomMethod = function (...args) { return bom(this, ...args); };
Shape$1.prototype.bom = bomMethod;

bomMethod.signature = 'Shape -> bom() -> string';

const items = (shape, op = (_ => _)) => {
  const items = [];
  for (const solid of getItems(shape.toKeptGeometry())) {
    items.push(op(Shape$1.fromGeometry(solid)));
  }
  return items;
};

const itemsMethod = function (...args) { return items(this, ...args); };
Shape$1.prototype.items = itemsMethod;

items.signature = 'items(shape:Shape, op:function) -> Shapes';
itemsMethod.signature = 'Shape -> items(op:function) -> Shapes';

const toBillOfMaterial = (shape) => {
  const specifications = [];
  for (const { tags } of getItems(shape.toKeptGeometry())) {
    for (const tag of tags) {
      if (tag.startsWith('item/')) {
        const specification = tag.substring(5);
        specifications.push(specification);
      }
    }
  }
  return specifications;
};

const toBillOfMaterialMethod = function (options = {}) { return toBillOfMaterial(this); };

Shape.prototype.toBillOfMaterial = toBillOfMaterialMethod;

const api = { Item, bom, items, toBillOfMaterial: toBillOfMaterialMethod };

export default api;
export { Item, bom, items, toBillOfMaterialMethod as toBillOfMaterial };
