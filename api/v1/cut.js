import Shape from './Shape';
import difference from './difference';

/**
 *
 * # shape.cut(...shapes)
 *
 * Produces a version of shape with the regions overlapped by shapes removed.
 *
 * shape.cut(...shapes) is equivalent to difference(shape, ...shapes).
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Cube(10).below().cut(Cube(5).below())
 * ```
 * :::
 *
 **/

const method = function (...shapes) { return difference(this, ...shapes); };
Shape.prototype.cut = method;
