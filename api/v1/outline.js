import { Shape } from './Shape';
import { getZ0Surfaces } from '@jsxcad/geometry-tagged';
import { union } from '@jsxcad/geometry-z0surface';

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
  // FIX: Handle non-z0surfaces.
  return Shape.fromPaths(union(...getZ0Surfaces(shape.toGeometry())));
};

const method = function (options) { return outline(options, this); };

Shape.prototype.outline = method;
