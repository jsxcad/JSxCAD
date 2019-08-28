import { Shape } from './Shape';
import { close } from '@jsxcad/geometry-path';
import { getPaths } from '@jsxcad/geometry-tagged';
import { union } from '@jsxcad/geometry-z0surface-boolean';

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
  // FIX: Handle non-z0surfaces.
  const toUnion = [];
  for (const { paths } of getPaths(shape.toKeptGeometry())) {
    toUnion.push(paths.map(path => close(path)));
  }
  return Shape.fromPathsToZ0Surface(union(...toUnion));
};

const method = function (options) { return interior(options, this); };

Shape.prototype.interior = method;
