import Shape from './Shape.js';

// Is this better than s.get('part:*').tags('part')?
export const billOfMaterials = Shape.chainable(
  (op = (list) => (shape) => list) =>
    (shape) =>
      shape.get('part:*').tags('part', op)
);

Shape.registerMethod('billOfMaterials', billOfMaterials);
Shape.registerMethod('bom', billOfMaterials);
