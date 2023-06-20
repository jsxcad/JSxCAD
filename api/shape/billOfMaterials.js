import Shape from './Shape.js';
import { get } from './get.js';
import note from './note.js';

// Is this better than s.get('part:*').tags('part')?
export const billOfMaterials = Shape.registerMethod2(
  ['billOfMaterials', 'bom'],
  ['input', 'function'],
  (input, op = (...list) => note(`Materials: ${list.join(', ')}`)) =>
    get('part:*').tags('part', op)(input)
);
