import { getSolids, getSurfaces, getZ0Surfaces } from '@jsxcad/geometry-tagged';

import { Shape } from './Shape';
import { assemble } from './assemble';

const toWireframeFromSolid = (solid) => {
  const paths = [];
  for (const surface of solid) {
    paths.push(...surface);
  }
  return Shape.fromPaths(paths);
};

const toWireframeFromSurface = (surface) => {
  return Shape.fromPaths(surface);
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
    pieces.push(toWireframeFromSolid(solid));
  }
  for (const { surface } of getSurfaces(shape.toKeptGeometry())) {
    pieces.push(toWireframeFromSurface(surface));
  }
  for (const { z0Surface } of getZ0Surfaces(shape.toKeptGeometry())) {
    pieces.push(toWireframeFromSurface(z0Surface));
  }
  return assemble(...pieces);
};

const method = function (options) { return wireframe(options, this); };

Shape.prototype.wireframe = method;
Shape.prototype.withWireframe = function (options) { return assemble(this, wireframe(options, this)); };
