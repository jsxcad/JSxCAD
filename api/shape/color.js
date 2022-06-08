import Shape from './Shape.js';
import { toTagsFromName } from '@jsxcad/algorithm-color';

export const color = Shape.chainable(
  (name) => (shape) => shape.untag('color:*').tag(...toTagsFromName(name))
);

Shape.registerMethod('color', color);
