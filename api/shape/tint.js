import Shape from './Shape.js';
import { toTagsFromName } from '@jsxcad/algorithm-color';

// Tint adds another color to the mix.
export const tint = Shape.chainable(
  (name) => (shape) => shape.tag(...toTagsFromName(name))
);

Shape.registerMethod('tint', tint);
