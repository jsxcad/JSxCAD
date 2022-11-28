import Shape from './Shape.js';
import { get } from './get.js';
import note from './note.js';

// Is this better than s.get('part:*').tags('part')?
export const billOfMaterials = Shape.registerMethod(
  ['billOfMaterials', 'bom'],
  (op = (...list) => note(`Materials: ${list.join(', ')}`)) =>
    (shape) =>
      get('part:*').tags('part', op)(shape)
);
