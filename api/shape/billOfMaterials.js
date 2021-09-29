import Shape from './Shape.js';
import { visit } from '@jsxcad/geometry';

// Is this better than s.get('part:*').tags('part')?
export const billOfMaterials =
  (op = (list) => list) =>
  (shape) => {
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
    return op(billOfMaterials, shape);
  };

Shape.registerMethod('billOfMaterials', billOfMaterials);
Shape.registerMethod('bom', billOfMaterials);
