import { Shape } from '@jsxcad/api-v1-shape';
import { grow } from './grow.js';
import { outline } from '@jsxcad/api-v1-extrude';

export const offset = (shape, radius = 1, resolution = 16) =>
  outline(grow(shape, radius, resolution));

const offsetMethod = function (radius, resolution) {
  return offset(this, radius, resolution);
};
Shape.prototype.offset = offsetMethod;

export default offset;
