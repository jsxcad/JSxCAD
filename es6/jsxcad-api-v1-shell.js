import Shape$1, { union, assemble, Shape } from './jsxcad-api-v1-shape.js';
import { Sphere, Circle } from './jsxcad-api-v1-shapes.js';
import { getSolids, getAnySurfaces, outline, transform } from './jsxcad-geometry-tagged.js';
import { Hull, outline as outline$1 } from './jsxcad-api-v1-extrude.js';
import { getEdges } from './jsxcad-geometry-path.js';
import { toPlane } from './jsxcad-geometry-surface.js';
import { toXYPlaneTransforms } from './jsxcad-math-plane.js';

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
        pieces.push(Hull(...polygon.map(point => Sphere(radius, resolution).move(...point))));
      }
    }
    shells.push(union(...pieces).as(...tags));
  }
  assembly.push(union(...shells));

  // Handle surface aspects.
  for (const geometry of getAnySurfaces(keptGeometry)) {
    const anySurface = geometry.surface || geometry.z0Surface;
    const plane = toPlane(anySurface);
    if (plane === undefined) {
      continue;
    }
    const [to, from] = toXYPlaneTransforms(plane);
    const pieces = [];
    for (const { paths } of outline(transform(to, geometry))) {
      for (const path of paths) {
        for (const edge of getEdges(path)) {
          // FIX: Handle non-z0-surfaces properly.
          pieces.push(Hull(...edge.map(([x, y]) => Circle(radius, resolution).move(x, y))));
        }
      }
    }
    assembly.push(assemble(...pieces.map(piece => piece.transform(from))).as(...(geometry.tags || [])));
  }

  return assemble(...assembly);
};

const method = function (radius, resolution) { return shell(this, radius, resolution); };
Shape.prototype.shell = method;

/**
 *
 * # grow
 *
 * Moves the edges of the shape inward by the specified amount.
 *
 * ::: illustration { "view": { "position": [60, -60, 60], "target": [0, 0, 0] } }
 * ```
 * Cube(10).with(Cube(10).moveX(10).grow(2))
 * ```
 * :::
 **/

const grow = (shape, amount = 1, { resolution = 16 } = {}) =>
  (amount >= 0)
    ? shape.union(shell(shape, amount, resolution))
    : shape.cut(shell(shape, -amount, resolution));

const growMethod = function (...args) { return grow(this, ...args); };
Shape$1.prototype.grow = growMethod;

grow.signature = 'grow(shape:Shape, amount:number = 1, { resolution:number = 16 }) -> Shape';
growMethod.signature = 'Shape -> grow(amount:number = 1, { resolution:number = 16 }) -> Shape';

const offset = (shape, radius = 1, resolution = 16) => outline$1(grow(shape, radius, resolution));

const offsetMethod = function (radius, resolution) { return offset(this, radius, resolution); };
Shape.prototype.offset = offsetMethod;

offset.signature = 'offset(shape:Shape, radius:number = 1, resolution:number = 16) -> Shape';
offsetMethod.signature = 'Shape -> offset(radius:number = 1, resolution:number = 16) -> Shape';

/**
 *
 * # shrink
 *
 * Moves the edges of the shape inward by the specified amount.
 *
 * ::: illustration { "view": { "position": [60, -60, 60], "target": [0, 0, 0] } }
 * ```
 * Cube(10).wireframe().with(Cube(10).shrink(2))
 * ```
 * :::
 **/

const byRadius = (shape, amount = 1, { resolution = 16 } = {}) => grow(shape, -amount, resolution);

const shrink = (...args) => byRadius(...args);

shrink.byRadius = byRadius;

const shrinkMethod = function (radius, resolution) { return shrink(this, radius, resolution); };
Shape$1.prototype.shrink = shrinkMethod;

shrink.signature = 'shrink(shape:Shape, amount:number = 1, { resolution:number = 16 }) -> Shape';
shrinkMethod.signature = 'Shape -> shrink(amount:number = 1, { resolution:number = 16 }) -> Shape';

const api = {
  grow,
  offset,
  shell,
  shrink
};

export default api;
export { grow, offset, shell, shrink };
