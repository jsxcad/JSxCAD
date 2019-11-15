import Shape from './Shape';
import difference from './difference';

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

const method = function (...shapes) { return difference(this, ...shapes); };
Shape.prototype.add = method;
