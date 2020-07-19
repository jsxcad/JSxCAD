import {
  getAnyNonVoidSurfaces,
  getNonVoidSolids,
  taggedAssembly,
  taggedSurface,
} from '@jsxcad/geometry-tagged';

import { Hull } from '@jsxcad/api-v1-extrude';
import { Shape } from '@jsxcad/api-v1-shape';
import { Sphere } from '@jsxcad/api-v1-shapes';

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

export const Shell = (radius = 1, resolution = 3, ...shapes) => {
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

export default Shell;
