import Shape from './Shape.js';
import note from './note.js';

// Is this better than s.get('part:*').tags('part')?
export const billOfMaterials = Shape.chainable(
  (op = (list) => note(`Materials: ${list.join(', ')}`)) =>
    (shape) =>
      shape.get('part:*').tags('part', op)
);

Shape.registerMethod('billOfMaterials', billOfMaterials);
Shape.registerMethod('bom', billOfMaterials);
