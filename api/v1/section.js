import { getAnySurfaces, getSolids } from '@jsxcad/geometry-tagged';

import { Shape } from './Shape';
import { Z0 } from './Z0';
import { assemble } from './assemble';
import { section as bspSection } from '@jsxcad/algorithm-bsp-surfaces';
import { retessellate } from '@jsxcad/geometry-z0surface';
import { union } from './union';

/**
 *
 * # Section
 *
 * Produces a cross-section of a solid as a surface.
 *
 * ::: illustration { "view": { "position": [40, 40, 60] } }
 * ```
 * difference(Cylinder(10, 10),
 *            Cylinder(8, 10))
 * ```
 * :::
 * ::: illustration
 * ```
 * difference(Sphere(10),
 *            Sphere(8))
 *   .section()
 * ```
 * :::
 * ::: illustration
 * ```
 * difference(Sphere(10),
 *            Sphere(8))
 *   .section()
 *   .outline()
 * ```
 * :::
 *
 **/

export const section = (solidShape, surfaceShape = Z0()) => {
  const shapes = [];
  const sections = [];
  for (const { surface, z0Surface } of getAnySurfaces(surfaceShape.toKeptGeometry())) {
    const anySurface = surface || z0Surface;
    for (const { solid } of getSolids(solidShape.toKeptGeometry())) {
      const surface = retessellate(bspSection(solid, anySurface));
      shapes.push(Shape.fromGeometry({ surface }));
    }
    sections.push(union(...shapes));
  }
  return assemble(...sections);
};

const method = function (surface) { return section(this, surface); };

Shape.prototype.section = method;
