import Shape from './Shape';
import shell from './shell';

/**
 *
 * # expand
 *
 * Moves the edges of the shape inward by the specified amount.
 *
 * ::: illustration { "view": { "position": [60, -60, 60], "target": [0, 0, 0] } }
 * ```
 * Cube(10).with(Cube(10).moveX(10).expand(2))
 * ```
 * :::
 **/

export const expand = (shape, radius = 1, resolution = 16) =>
  (radius >= 0) ? shape.union(shell(shape, radius, resolution))
    : shape.difference(shell(shape, -radius, resolution));

const method = function (radius, resolution) { return expand(this, radius, resolution); };
Shape.prototype.expand = method;

export default expand;
