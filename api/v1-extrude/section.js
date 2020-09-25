import { getPlans, getSolids } from '@jsxcad/geometry-tagged';

import { Group } from '@jsxcad/api-v1-shapes';
import { Shape } from '@jsxcad/api-v1-shape';
import { Z } from '@jsxcad/api-v1-connector';
import { section as bspSection } from '@jsxcad/geometry-bsp';
import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { makeConvex } from '@jsxcad/geometry-surface';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';
import { transform } from '@jsxcad/geometry-path';

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
  const path = [
    [max, max, 0],
    [min, max, 0],
    [min, min, 0],
    [max, min, 0],
  ];
  const polygon = transform(from, path);
  return [polygon];
};

export const section = (solidShape, ...connectors) => {
  if (connectors.length === 0) {
    connectors.push(Z(0));
  }
  const planes = connectors.map(toPlane);
  const planeSurfaces = planes.map(toSurface);
  const shapes = [];
  const normalize = createNormalize3();
  for (const { solid, tags } of getSolids(solidShape.toKeptGeometry())) {
    const sections = bspSection(solid, planeSurfaces, normalize);
    const surfaces = sections.map((section) => makeConvex(section, normalize));
    for (let i = 0; i < surfaces.length; i++) {
      surfaces[i].plane = planes[i];
      shapes.push(
        Shape.fromGeometry({ type: 'surface', surface: surfaces[i], tags })
      );
    }
  }
  return Group(...shapes);
};

const sectionMethod = function (...args) {
  return section(this, ...args);
};
Shape.prototype.section = sectionMethod;

export default section;
