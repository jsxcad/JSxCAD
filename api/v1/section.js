import { alignVertices, toPolygons } from '@jsxcad/geometry-solid';
import { cutTrianglesByPlane, toTriangles } from '@jsxcad/geometry-polygons';

import { Shape } from './Shape';
import { fromPoints } from '@jsxcad/math-plane';
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

export const section = ({ allowOpenPaths = false, z = 0 } = {}, shape) => {
  const shapes = [];
  for (const { solid } of getSolids(shape.toKeptGeometry())) {
    const polygons = toPolygons({}, alignVertices(solid));
    const triangles = toTriangles({}, polygons);
    const paths = cutTrianglesByPlane({ allowOpenPaths }, fromPoints([0, 0, z], [1, 0, z], [0, 1, z]), triangles);
    shapes.push(Shape.fromPathsToZ0Surface(paths));
  }
  return union(...shapes);
};

const method = function (options) { return section(options, this); };

Shape.prototype.section = method;
