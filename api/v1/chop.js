import { getAnySurfaces, getSolids } from '@jsxcad/geometry-tagged';

import Shape from './Shape';
import Z from './Z';
import assemble from './assemble';
import { cut as bspCut } from '@jsxcad/algorithm-bsp-surfaces';
import { cut as surfaceCut } from '@jsxcad/geometry-surface';

/**
 *
 * # Chop
 *
 * Remove the parts of a shape above surface, defaulting to Z(0).
 *
 * ::: illustration { "view": { "position": [60, -60, 60], "target": [0, 0, 0] } }
 * ```
 * Cube(10).with(Cube(10).moveX(10).chop(Z(0)));
 * ```
 * :::
 * ::: illustration { "view": { "position": [60, -60, 60], "target": [0, 0, 0] } }
 * ```
 * Cube(10).with(Cube(10).moveX(10).chop(Z(0).flip()));
 * ```
 * :::
 *
 **/

export const chop = (shape, planeShape = Z()) => {
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

const chopMethod = function (surface) { return chop(this, surface); };
Shape.prototype.chop = chopMethod;

export default chop;

chop.signature = 'chop(shape:Shape, surface:Shape) -> Shape';
chopMethod.signature = 'Shape -> chop(surface:Shape) -> Shape';
