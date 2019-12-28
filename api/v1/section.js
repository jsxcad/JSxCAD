import { getPlans, getSolids } from '@jsxcad/geometry-tagged';

import { Shape } from './Shape';
import { Z } from './Z';
import { section as bspSection } from '@jsxcad/algorithm-bsp-surfaces';
import { makeConvex } from '@jsxcad/geometry-surface';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';
import { transform } from '@jsxcad/geometry-path';
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

const toPlane = (connector) => {
  for (const entry of getPlans(connector.toKeptGeometry())) {
    if (entry.plan && entry.plan.connector) {
      return entry.planes[0];
    }
  }
};

const toSurface = (plane) => {
  const max = +1e5;
  const min = -1e5;
  const [, from] = toXYPlaneTransforms(plane);
  const path = [[max, max, 0], [min, max, 0], [min, min, 0], [max, min, 0]];
  const polygon = transform(from, path);
  return [polygon];
};

export const section = (solidShape, connector = Z(0)) => {
  const plane = toPlane(connector);
  const planeSurface = toSurface(plane);
  const shapes = [];
  for (const { solid } of getSolids(solidShape.toKeptGeometry())) {
    const section = bspSection(solid, planeSurface);
    // CHECK: Do we need to do this?
    const surface = makeConvex(section);
    surface.plane = plane;
    shapes.push(Shape.fromGeometry({ surface }));
  }
  return union(...shapes);
};

const method = function (surface) { return section(this, surface); };

Shape.prototype.section = method;
