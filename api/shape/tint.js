import Shape from './Shape.js';
import { tag } from './tag.js';
import { toTagsFromName } from '@jsxcad/algorithm-color';

// Tint adds another color to the mix.
export const tint = Shape.registerMethod(
  'tint',
  (name) => (shape) => tag(...toTagsFromName(name))(shape)
);
