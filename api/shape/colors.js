import { Shape } from './Shape.js';
import { allTags } from '@jsxcad/geometry';

export const colors =
  (op = (colors, shape) => colors) =>
  (shape) =>
    op(
      [...allTags(shape.toGeometry())]
        .filter((tag) => tag.startsWith('color/'))
        .map((tag) => tag.substring(6)),
      shape
    );

Shape.registerMethod('colors', colors);

export default colors;
