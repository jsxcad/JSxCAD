import { getNonVoidSolids, getAnyNonVoidSurfaces, taggedSurface, taggedAssembly, getSolids, taggedLayers } from './jsxcad-geometry-tagged.js';
import { Hull, outline } from './jsxcad-api-v1-extrude.js';
import Shape$1, { Shape } from './jsxcad-api-v1-shape.js';
import { Sphere } from './jsxcad-api-v1-shapes.js';
import { toConvexClouds, fromSolid } from './jsxcad-geometry-bsp.js';
import { createNormalize3 } from './jsxcad-algorithm-quantize.js';

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

const Shell = (radius = 1, resolution = 3, ...shapes) => {
  resolution = Math.max(resolution, 3);
  const pieces = [];
  for (const shape of shapes) {
    for (const { solid, tags = [] } of getNonVoidSolids(
      shape.toDisjointGeometry()
    )) {
      for (const surface of solid) {
        for (const polygon of surface) {
          pieces.push(
            Hull(
              ...polygon.map((point) =>
                Sphere(radius, { resolution }).move(...point)
              )
            )
              .setTags(tags)
              .toGeometry()
          );
        }
      }
    }
    // FIX: This is more expensive than necessary.
    for (const { surface, z0Surface, tags } of getAnyNonVoidSurfaces(
      shape.toDisjointGeometry()
    )) {
      const surfaceShape = Shape.fromGeometry(
        taggedSurface({ tags }, surface || z0Surface)
      );
      pieces.push(
        // surfaceShape.planes()[0].clip(surfaceShape.outline().sweep(Sphere(radius, { resolution }))).toGeometry()
        surfaceShape
          .outline()
          .sweep(Sphere(radius, { resolution }))
          .toGeometry()
      );
    }
  }

  return Shape.fromGeometry(taggedAssembly({}, ...pieces));
};

const shellMethod = function (radius, resolution) {
  return Shell(radius, resolution, this);
};
Shape.prototype.shell = shellMethod;

const outerShellMethod = function (radius, resolution) {
  return Shell(radius, resolution, this).cut(this);
};
Shape.prototype.outerShell = outerShellMethod;

const innerShellMethod = function (radius, resolution) {
  return Shell(radius, resolution, this).clip(this);
};
Shape.prototype.innerShell = innerShellMethod;

const grow = (shape, amount = 1, { resolution = 3 } = {}) => {
  const normalize = createNormalize3();
  resolution = Math.max(resolution, 3);
  const pieces = [];
  for (const { solid, tags = [] } of getSolids(shape.toDisjointGeometry())) {
    for (const cloud of toConvexClouds(
      fromSolid(solid, normalize),
      normalize
    )) {
      pieces.push(
        Hull(...cloud.map((point) => Sphere(amount, resolution).move(...point)))
          .setTags(tags)
          .toGeometry()
      );
    }
  }
  return Shape.fromGeometry(taggedLayers({}, ...pieces));
};

const growMethod = function (...args) {
  return grow(this, ...args);
};
Shape.prototype.grow = growMethod;

const offset = (shape, radius = 1, resolution = 16) =>
  outline(grow(shape, radius, resolution));

const offsetMethod = function (radius, resolution) {
  return offset(this, radius, resolution);
};
Shape.prototype.offset = offsetMethod;

const shrink = (shape, amount, { resolution = 3 } = {}) =>
  shape.cut(Shell(amount, { resolution }, shape));

const shrinkMethod = function (amount, { resolution = 3 } = {}) {
  return shrink(this, amount, { resolution });
};
Shape$1.prototype.shrink = shrinkMethod;

const api = {
  Shell,
  grow,
  offset,
  shrink,
};

export default api;
export { Shell, grow, offset, shrink };
