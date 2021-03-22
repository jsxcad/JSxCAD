import Shape from './Shape.js';
import { smooth as smoothGeometry } from '@jsxcad/geometry-tagged';

export const smooth = (shape, options = {}) =>
  Shape.fromGeometry(smoothGeometry(shape.toGeometry(), options));

const smoothMethod = function (options) {
  return smooth(this, options);
};

Shape.prototype.smooth = smoothMethod;
