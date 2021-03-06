import { Shape } from './Shape.js';
import { allTags } from '@jsxcad/geometry-tagged';

export const colors = (shape, op = (colors, shape) => colors) =>
  op(
    [...allTags(shape.toGeometry())]
      .filter((tag) => tag.startsWith('color/'))
      .map((tag) => tag.substring(6)),
    shape
  );

const colorsMethod = function (op) {
  return colors(this, op);
};
Shape.prototype.colors = colorsMethod;

export default colors;
