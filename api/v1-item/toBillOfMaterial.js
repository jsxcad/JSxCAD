import { Shape } from '@jsxcad/api-v1-shape';
import { getItems } from '@jsxcad/geometry-tagged';

export const toBillOfMaterial = (shape) => {
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

const toBillOfMaterialMethod = function (options = {}) {
  return toBillOfMaterial(this);
};

Shape.prototype.toBillOfMaterial = toBillOfMaterialMethod;

export default toBillOfMaterialMethod;
