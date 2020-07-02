import Shape from '@jsxcad/api-v1-shape';
import grow from './grow.js';

/**
 *
 * # shrink
 *
 * Moves the edges of the shape inward by the specified amount.
 *
 * ::: illustration { "view": { "position": [60, -60, 60], "target": [0, 0, 0] } }
 * ```
 * Cube(10).wireframe().with(Cube(10).shrink(2))
 * ```
 * :::
 **/

export const byRadius = (shape, amount = 1, { resolution = 16 } = {}) =>
  grow(shape, -amount, resolution);

export const shrink = (...args) => byRadius(...args);

shrink.byRadius = byRadius;

const shrinkMethod = function (radius, resolution) {
  return shrink(this, radius, resolution);
};
Shape.prototype.shrink = shrinkMethod;

export default shrink;

shrink.signature =
  'shrink(shape:Shape, amount:number = 1, { resolution:number = 16 }) -> Shape';
shrinkMethod.signature =
  'Shape -> shrink(amount:number = 1, { resolution:number = 16 }) -> Shape';
