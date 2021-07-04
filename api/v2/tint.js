import Shape from './Shape.js';
import { rewriteTags } from '@jsxcad/geometry';
import { toTagsFromName } from '@jsxcad/algorithm-color';

export const fromName = (shape, name) =>
  Shape.fromGeometry(rewriteTags(toTagsFromName(name), [], shape.toGeometry()));

// Tint adds another color to the mix.
export const tint =
  (...args) =>
  (shape) =>
    fromName(shape, ...args);

Shape.registerMethod('tint', tint);
