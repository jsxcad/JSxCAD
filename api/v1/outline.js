import { getSurfaces, getZ0Surfaces } from '@jsxcad/geometry-tagged';

import { Shape } from './Shape';
import { assemble } from './assemble';

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
  const keptGeometry = shape.toKeptGeometry();
  const z0Surfaces = getZ0Surfaces(keptGeometry);
  const surfaces = getSurfaces(keptGeometry);
  return assemble(...z0Surfaces.map(({ z0Surface }) => Shape.fromPaths(z0Surface)),
                  ...surfaces.map(({ surface }) => Shape.fromPaths(surface)));
};

const method = function (options) { return outline(options, this); };

Shape.prototype.outline = method;
Shape.prototype.withOutline = function (options) { return assemble(this, outline(options, this)); };
