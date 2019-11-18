import { Shape } from './Shape';
import { allTags } from '@jsxcad/geometry-tagged';

export const colors = (shape) =>
  [...allTags(shape.toGeometry())]
      .filter(tag => tag.startsWith('color/'))
      .map(tag => tag.substring(6));

const colorsMethod = function () { return colors(this); };
Shape.prototype.colors = colorsMethod;

export default colors;
