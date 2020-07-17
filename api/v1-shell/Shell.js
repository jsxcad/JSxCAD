import { getSolids, taggedLayers } from '@jsxcad/geometry-tagged';

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
    for (const { solid, tags = [] } of getSolids(shape.toDisjointGeometry())) {
      for (const surface of solid) {
        for (const polygon of surface) {
          pieces.push(
            Hull(
              ...polygon.map((point) =>
                Sphere(radius, resolution).move(...point)
              )
            )
              .setTags(tags)
              .toGeometry()
          );
        }
      }
    }
  }

  return Shape.fromGeometry(taggedLayers({}, ...pieces));
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
