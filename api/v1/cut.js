import { getAnySurfaces, getSolids } from '@jsxcad/geometry-tagged';

import { Shape } from './Shape';
import { Z } from './Z';
import { assemble } from './assemble';
import { cut as bspCut } from '@jsxcad/algorithm-bsp-surfaces';
import { cut as surfaceCut } from '@jsxcad/geometry-surface';

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

export const cut = (shape, planeShape = Z()) => {
  const cuts = [];
  for (const { surface, z0Surface } of getAnySurfaces(planeShape.toKeptGeometry())) {
    const planeSurface = surface || z0Surface;
    for (const { solid, tags } of getSolids(shape.toKeptGeometry())) {
      const cutResult = bspCut(solid, planeSurface);
      cuts.push(Shape.fromGeometry({ solid: cutResult, tags }));
    }
  }

  for (const { surface, z0Surface } of getAnySurfaces(planeShape.toKeptGeometry())) {
    const planeSurface = surface || z0Surface;
    for (const { surface, z0Surface, tags } of getAnySurfaces(shape.toKeptGeometry())) {
      const cutSurface = surface || z0Surface;
      const cutResult = surfaceCut(planeSurface, cutSurface);
      cuts.push(Shape.fromGeometry({ surface: cutResult, tags }));
    }
  }

  return assemble(...cuts);
};

const method = function (surface) { return cut(this, surface); };

Shape.prototype.cut = method;
