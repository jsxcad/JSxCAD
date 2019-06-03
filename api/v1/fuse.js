import { Shape, fromGeometry, toKeptGeometry } from './Shape';

/**
 *
 * # Fuse
 *
 * Fuse produces a simple version of a shape. All substructure is discarded.
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * assemble(sphere(10), sphere(10).translate(2).drop()).fuse()
 * ```
 * :::
 *
 **/

export const fuse = (shape) => fromGeometry(toKeptGeometry(shape));

const method = function () { return fuse(this); };

Shape.prototype.fuse = method;
