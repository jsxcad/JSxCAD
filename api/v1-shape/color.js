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

// FIX: Have color remove all other color tags.
export const color =
  (...args) =>
  (shape) =>
    fromName(shape, ...args);

Shape.registerMethod('color', color);
Shape.registerMethod('tint', tint);
