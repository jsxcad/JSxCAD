import Shape from './Shape.js';
import { toTagsFromName } from '@jsxcad/algorithm-color';

export const color = Shape.registerMethod(
  'color',
  (name) => (shape) => shape.untag('color:*').tag(...toTagsFromName(name))
);
