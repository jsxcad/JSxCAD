import { getSolids, getZ0Surfaces } from '@jsxcad/geometry-tagged';

import { Shape } from './Shape';
import { assemble } from './assemble';
import { cut as cutSolid } from '@jsxcad/geometry-solid';
import { cut as cutSurface } from '@jsxcad/geometry-surface';
import { fromPoints } from '@jsxcad/math-plane';

/**
 *
 * # Cut
 *
 * Cuts a shape into two halves at z = 0, and returns each.
 *
 * ::: illustration { "view": { "position": [40, 40, 60] } }
 * ```
 * const [top, bottom] = cube(10).cut();
 * assemble(top.translate(0, 0, 1),
 *          bottom.translate(0, 0, -1));
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 60] } }
 * ```
 * const [top, bottom] = sphere(10).cut();
 * assemble(top.translate(0, 0, 2),
 *          bottom.translate(0, 0, -2));
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 60] } }
 * ```
 * const [top, bottom] = sphere(10).rotateY(1).cut();
 * assemble(top.translate(0, 0, 2),
 *          bottom.translate(0, 0, -2));
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 60] } }
 * ```
 * assemble(circle(10),
 *          cylinder(5, 10))
 *   .rotateY(90)
 *   .cut()[0]
 * ```
 * :::
 *
 **/

export const cut = (plane = [0, 0, 1, 0], shape) => {
  const fronts = [];
  const backs = [];
  const keptGeometry = shape.toKeptGeometry();
  for (const { solid } of getSolids(keptGeometry)) {
    const [front, back] = cutSolid(plane, solid);
    fronts.push(Shape.fromSolid(front));
    backs.push(Shape.fromSolid(back));
  }
  // FIX: Generalized surfaces.
  for (const { z0Surface } of getZ0Surfaces(keptGeometry)) {
    const [front, back] = cutSurface(plane, z0Surface);
    fronts.push(Shape.fromPathsToZ0Surface(front));
    backs.push(Shape.fromPathsToZ0Surface(back));
  }
  return [assemble(...fronts), assemble(...backs)];
};

const method = function (options) { return cut(options, this); };

Shape.prototype.cut = method;
