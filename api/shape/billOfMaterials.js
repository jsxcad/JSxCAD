import Shape from './Shape.js';
import { visit } from '@jsxcad/geometry';

export const billOfMaterials = () => (shape) => {
  const billOfMaterials = [];
  const walk = (geometry, descend, path) => {
    if (geometry.type === 'item') {
      let isPart = false;
      for (const tag of geometry.tags) {
        if (tag.startsWith('part:')) {
          billOfMaterials.push(tag.substring(5));
          isPart = true;
        }
      }
      if (isPart) {
        // Don't descend through parts to find sub-parts.
        return;
      }
    }
    descend();
  };
  visit(shape.toGeometry(), walk);
  return billOfMaterials;
};

Shape.registerMethod('billOfMaterials', billOfMaterials);
Shape.registerMethod('bom', billOfMaterials);
