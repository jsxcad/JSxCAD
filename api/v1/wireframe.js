import { Shape } from './Shape';
import { assemble } from './assemble';
import { getSolids } from '@jsxcad/geometry-tagged';
import { makeSurfacesSimple } from '@jsxcad/geometry-solid';

const toWireframe = (solid) => {
  const paths = [];
  for (const surface of makeSurfacesSimple({}, solid)) {
    paths.push(...surface);
  }
  return Shape.fromPaths(paths);
};

/**
 *
 * # Wireframe
 *
 * Generates a set of paths outlining a solid.
 *
 * ::: illustration { "view": { "position": [-40, -40, 40] } }
 * ```
 * cube(10).wireframe()
 * ```
 * :::
 * ::: illustration { "view": { "position": [-40, -40, 40] } }
 * ```
 * sphere(10).wireframe()
 * ```
 * :::
 *
 **/

export const wireframe = (options = {}, shape) => {
  const solids = getSolids(shape.toKeptGeometry());
  return assemble(...solids.map(toWireframe));
};

const method = function (options) { return wireframe(options, this); };

Shape.prototype.wireframe = method;
