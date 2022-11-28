import Shape from './Shape.js';
import { toTagsFromName } from '@jsxcad/algorithm-color';
import { untag } from './untag.js';

export const color = Shape.registerMethod(
  'color',
  (name) => async (shape) =>
    untag('color:*').tag(...toTagsFromName(name))(shape)
);
