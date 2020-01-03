import { Shape, assemble } from '@jsxcad/api-v1-shape';

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

export const interior = (shape) => {
  const surfaces = [];
  for (const { paths } of getPaths(shape.toKeptGeometry())) {
    // FIX: Check paths for coplanarity.
    surfaces.push(Shape.fromPathsToSurface(paths.filter(isClosed).filter(path => path.length >= 3)));
  }
  return assemble(...surfaces);
};

const interiorMethod = function (...args) { return interior(this, ...args); };
Shape.prototype.interior = interiorMethod;

interior.signature = 'interior(shape:Shape) -> Shape';
interiorMethod.signature = 'Shape -> interior() -> Shape';

export default interior;
