import Shape from './Shape';
import union from './union';

/**
 *
 * # shape.add(...shapes)
 *
 * Produces a version of shape with the regions overlapped by shapes added.
 *
 * shape.add(...shapes) is equivalent to union(shape, ...shapes).
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Cube(10).below().add(Cube(5).moveX(5).below())
 * ```
 * :::
 *
 **/

const method = function (...shapes) { return union(this, ...shapes); };
Shape.prototype.add = method;
