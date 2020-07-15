import Shape, { Shape as Shape$1 } from './jsxcad-api-v1-shape.js';
import { grow as grow$1, getSolids, getAnySurfaces, outline as outline$1, transform } from './jsxcad-geometry-tagged.js';
import { outline, Hull } from './jsxcad-api-v1-extrude.js';
import { Sphere, Union, Circle, Assembly } from './jsxcad-api-v1-shapes.js';
import { getEdges } from './jsxcad-geometry-path.js';
import { toPlane } from './jsxcad-geometry-surface.js';
import { toXYPlaneTransforms } from './jsxcad-math-plane.js';

const grow = (shape, amount = 0) =>
  Shape.fromGeometry(grow$1(shape.toGeometry(), amount));

const growMethod = function (amount = 0) { return grow(this, amount); };
Shape.prototype.grow = growMethod;

/*
import shell from './shell.js';

export const grow = (shape, amount = 1, { resolution = 16 } = {}) =>
  amount >= 0
    ? shape.union(shell(shape, amount, resolution))
    : shape.cut(shell(shape, -amount, resolution));

const growMethod = function (...args) {
  return grow(this, ...args);
};
Shape.prototype.grow = growMethod;

export default grow;
*/

const offset = (shape, radius = 1, resolution = 16) =>
  outline(grow(shape, radius));

const offsetMethod = function (radius, resolution) {
  return offset(this, radius, resolution);
};
Shape$1.prototype.offset = offsetMethod;

/**
 *
 * # Shell
 *
 * Converts a solid into a hollow shell of a given thickness.
 *
 * ::: illustration
 * ```
 * Cube(10).shell(1);
 * ```
 * :::
 *
 **/

const shell = (shape, radius = 1, resolution = 8) => {
  resolution = Math.max(resolution, 3);
  const keptGeometry = shape.toKeptGeometry();
  const assembly = [];

  // Handle solid aspects.
  const shells = [];
  for (const { solid, tags = [] } of getSolids(keptGeometry)) {
    const pieces = [];
    for (const surface of solid) {
      for (const polygon of surface) {
        pieces.push(
          Hull(
            ...polygon.map((point) => Sphere(radius, resolution).move(...point))
          )
        );
      }
    }
    shells.push(Union(...pieces).as(...tags));
  }
  assembly.push(Union(...shells));

  const faces = [];
  // Handle surface aspects.
  for (const geometry of getAnySurfaces(keptGeometry)) {
    const anySurface = geometry.surface || geometry.z0Surface;
    const plane = toPlane(anySurface);
    if (plane === undefined) {
      continue;
    }
    const [to, from] = toXYPlaneTransforms(plane);
    const pieces = [];
    for (const { paths } of outline$1(transform(to, geometry))) {
      for (const path of paths) {
        for (const edge of getEdges(path)) {
          // FIX: Handle non-z0-surfaces properly.
          pieces.push(
            Hull(...edge.map(([x, y]) => Circle(radius, resolution).move(x, y)))
          );
        }
      }
    }
    faces.push(
      Union(...pieces.map((piece) => piece.transform(from))).as(
        ...(geometry.tags || [])
      )
    );
  }
  assembly.push(Union(...faces));

  return Assembly(...assembly);
};

const shellMethod = function (radius, resolution) {
  return shell(this, radius, resolution);
};
Shape$1.prototype.shell = shellMethod;

const outerShellMethod = function (radius, resolution) {
  return shell(this, radius, resolution).cut(this);
};
Shape$1.prototype.outerShell = outerShellMethod;

const innerShellMethod = function (radius, resolution) {
  return shell(this, radius, resolution).clip(this);
};
Shape$1.prototype.innerShell = innerShellMethod;

const api = {
  grow,
  offset,
  shell,
};

export default api;
export { grow, offset, shell };
