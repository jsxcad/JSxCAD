import Shape from '@jsxcad/api-v1-shape';
import shell from './shell.js';

/**
 *
 * # grow
 *
 * Moves the edges of the shape inward by the specified amount.
 *
 * ::: illustration { "view": { "position": [60, -60, 60], "target": [0, 0, 0] } }
 * ```
 * Cube(10).with(Cube(10).moveX(10).grow(2))
 * ```
 * :::
 **/

export const grow = (shape, amount = 1, { resolution = 16 } = {}) =>
  amount >= 0
    ? shape.union(shell(shape, amount, resolution))
    : shape.cut(shell(shape, -amount, resolution));

const growMethod = function (...args) {
  return grow(this, ...args);
};
Shape.prototype.grow = growMethod;

export default grow;

grow.signature =
  'grow(shape:Shape, amount:number = 1, { resolution:number = 16 }) -> Shape';
growMethod.signature =
  'Shape -> grow(amount:number = 1, { resolution:number = 16 }) -> Shape';
