import { getAnySurfaces, getSolids } from '@jsxcad/geometry-tagged';

import { Shape } from './Shape';
import { Z0 } from './Z0';
import { assemble } from './assemble';
import { cut as bspCut } from '@jsxcad/algorithm-bsp-surfaces';

/**
 *
 * # Cut
 *
 * Cuts a shape into two halves at z = 0, and returns each.
 *
 * ::: illustration { "view": { "position": [40, 40, 60] } }
 * ```
 * const [top, bottom] = Cube(10).cut();
 * assemble(top.translate(0, 0, 1),
 *          bottom.translate(0, 0, -1));
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 60] } }
 * ```
 * const [top, bottom] = Sphere(10).cut();
 * assemble(top.translate(0, 0, 2),
 *          bottom.translate(0, 0, -2));
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 60] } }
 * ```
 * const [top, bottom] = Sphere(10).rotateY(1).cut();
 * assemble(top.translate(0, 0, 2),
 *          bottom.translate(0, 0, -2));
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 60] } }
 * ```
 * assemble(Circle(10),
 *          Cylinder(5, 10))
 *   .rotateY(90)
 *   .cut()[0]
 * ```
 * :::
 *
 **/

export const cut = (solidShape, surfaceShape = Z0()) => {
  const shapes = [];
  const cuts = [];
  for (const { surface, z0Surface } of getAnySurfaces(surfaceShape.toKeptGeometry())) {
    const anySurface = surface || z0Surface;
    for (const { solid } of getSolids(solidShape.toKeptGeometry())) {
      const cutResult = bspCut(solid, anySurface);
      shapes.push(Shape.fromGeometry({ solid: cutResult }));
    }
    cuts.push(...shapes);
  }
  return assemble(...cuts);
};

const method = function (surface) { return cut(this, surface); };

Shape.prototype.cut = method;
