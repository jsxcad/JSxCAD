import { Shape } from './Shape';
import { assemble } from './assemble';
import { getSolids } from '@jsxcad/geometry-tagged';

const toWireframe = (solid) => {
  const paths = [];
  // for (const surface of makeSurfacesSimple({}, solid)) {
  for (const surface of solid) {
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
 * Cube(10).wireframe()
 * ```
 * :::
 * ::: illustration { "view": { "position": [-40, -40, 40] } }
 * ```
 * Sphere(10).wireframe()
 * ```
 * :::
 *
 **/

export const wireframe = (options = {}, shape) => {
  const pieces = [];
  for (const { solid } of getSolids(shape.toKeptGeometry())) {
    pieces.push(toWireframe(solid));
  }
  return assemble(...pieces);
};

const method = function (options) { return wireframe(options, this); };

Shape.prototype.wireframe = method;
Shape.prototype.withWireframe = function (options) { return assemble(this, wireframe(options, this)); };
