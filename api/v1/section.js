import { getAnySurfaces, getSolids } from '@jsxcad/geometry-tagged';
import { retessellate, toPlane } from '@jsxcad/geometry-surface';

import { Shape } from './Shape';
import { Z } from './Z';
import { assemble } from './assemble';
import { section as bspSection } from '@jsxcad/algorithm-bsp-surfaces';
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

export const section = (solidShape, surfaceShape = Z(0)) => {
  const sections = [];
  for (const { surface, z0Surface } of getAnySurfaces(surfaceShape.toKeptGeometry())) {
    const anySurface = surface || z0Surface;
    const shapes = [];
    const plane = toPlane(anySurface);
    for (const { solid } of getSolids(solidShape.toKeptGeometry())) {
      const section = bspSection(solid, anySurface);
      const surface = retessellate(section);
      surface.plane = plane;
      shapes.push(Shape.fromGeometry({ surface }));
    }
    sections.push(union(...shapes));
  }
  return assemble(...sections);
};

const method = function (surface) { return section(this, surface); };

Shape.prototype.section = method;
