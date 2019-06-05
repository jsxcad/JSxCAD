import { Shape } from './Shape';
import { assemble } from './assemble';
import { getZ0Surfaces } from '@jsxcad/geometry-tagged';

/**
 *
 * # Outline
 *
 * Generates the outline of a surface.
 *
 * ::: illustration
 * ```
 * difference(circle(10),
 *            circle(2).translate([-4]),
 *            circle(2).translate([4]))
 * ```
 * :::
 * ::: illustration
 * ```
 * difference(circle(10),
 *            circle(2).translate([-4]),
 *            circle(2).translate([4]))
 *   .outline()
 * ```
 * :::
 *
 **/

export const outline = (options = {}, shape) => {
  const surfaces = getZ0Surfaces(shape.toKeptGeometry());
  // FIX: Handle non-z0surfaces.
  return assemble(...surfaces.map(surface => Shape.fromPaths(surface)));
};

const method = function (options) { return outline(options, this); };

Shape.prototype.outline = method;
