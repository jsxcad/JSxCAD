import Shape from '@jsxcad/api-v1-shape';

import { grow as growGeometry } from '@jsxcad/geometry-tagged';

export const grow = (shape, amount = 0) =>
  Shape.fromGeometry(growGeometry(shape.toGeometry(), amount));

const growMethod = function (amount = 0) { return grow(this, amount); };
Shape.prototype.grow = growMethod;

export default grow;

/*
import shell from './shell.js';

export const grow = (shape, amount = 1, { resolution = 16 } = {}) =>
  amount >= 0
    ? shape.union(shell(shape, amount, resolution))
    : shape.cut(shell(shape, -amount, resolution));

const growMethod = function (...args) {
  return grow(this, ...args);
};
Shape.prototype.grow = growMethod;

export default grow;
*/
