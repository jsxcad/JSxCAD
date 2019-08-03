import { Shape, toKeptGeometry } from './Shape';
import { fuse as fuseGeometry } from '@jsxcad/geometry-tagged';

/**
 *
 * # Fuse
 *
 * Fuse produces a simple version of a shape. All substructure is discarded.
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * assemble(Sphere(10), Sphere(10).translate(2).drop()).fuse()
 * ```
 * :::
 *
 **/

export const fuse = (shape) => Shape.fromGeometry(fuseGeometry(toKeptGeometry(shape)));

const method = function () { return fuse(this); };

Shape.prototype.fuse = method;
