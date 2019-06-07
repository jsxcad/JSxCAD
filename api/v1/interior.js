import { Shape } from './Shape';
import { getPaths } from '@jsxcad/geometry-tagged';
import { union } from '@jsxcad/geometry-z0surface';

/**
 *
 * # Interior
 *
 * Generates a surface from the interior of a simple closed path.
 *
 * ::: illustration
 * ```
 * circle(10)
 * ```
 * :::
 * ::: illustration
 * ```
 * circle(10)
 *   .outline()
 * ```
 * :::
 * ::: illustration
 * ```
 * circle(10)
 *   .outline()
 *   .interior()
 * ```
 * :::
 *
 **/

export const interior = (options = {}, shape) => {
  // FIX: Handle non-z0surfaces.
  const toUnion = [];
  for (const { paths } of getPaths(shape.toGeometry())) {
    toUnion.push(paths);
  }
  return Shape.fromPathsToZ0Surface(union(...toUnion));
};

const method = function (options) { return interior(options, this); };

Shape.prototype.interior = method;
