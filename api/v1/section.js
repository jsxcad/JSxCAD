import { Shape } from './Shape';
import { section as bspSection } from '@jsxcad/algorithm-bsp-surfaces';
import { getSolids } from '@jsxcad/geometry-tagged';
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

const X = 0;
const Y = 1;

export const section = ({ allowOpenPaths = false, z = 0 } = {}, shape) => {
  const shapes = [];
  const [min, max] = shape.measureBoundingBox();
  for (const { solid } of getSolids(shape.toKeptGeometry())) {
    const polygon = [[min[X], min[Y], z], [max[X], min[Y], z], [max[X], max[Y], z], [min[X], max[Y], z]];
    const surface = bspSection(solid, polygon);
    shapes.push(Shape.fromGeometry({ surface }));
  }
  return union(...shapes);
};

const method = function (options) { return section(options, this); };

Shape.prototype.section = method;
