import { Shape } from './Shape';
import { assemble } from './assemble';
import { getPaths } from '@jsxcad/geometry-tagged';
import { isClosed } from '@jsxcad/geometry-path';

/**
 *
 * # Interior
 *
 * Generates a surface from the interior of a simple closed path.
 *
 * ::: illustration
 * ```
 * Circle(10)
 * ```
 * :::
 * ::: illustration
 * ```
 * Circle(10)
 *   .outline()
 * ```
 * :::
 * ::: illustration
 * ```
 * Circle(10)
 *   .outline()
 *   .interior()
 * ```
 * :::
 *
 **/

export const interior = (options = {}, shape) => {
  const surfaces = [];
  for (const { paths } of getPaths(shape.toKeptGeometry())) {
    // FIX: Check paths for coplanarity.
    surfaces.push(Shape.fromPathsToSurface(paths.filter(isClosed)));
  }
  return assemble(...surfaces);
};

const method = function (options) { return interior(options, this); };

Shape.prototype.interior = method;
