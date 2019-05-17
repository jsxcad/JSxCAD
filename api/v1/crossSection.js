import { cutTrianglesByPlane, toTriangles } from '@jsxcad/geometry-polygons';

import { Shape } from './Shape';
import { assemble } from './assemble';
import { fromPoints } from '@jsxcad/math-plane';
import { getSolids } from '@jsxcad/geometry-eager';
import { toPolygons } from '@jsxcad/geometry-solid';

export const crossSection = ({ allowOpenPaths = false, z = 0 } = {}, shape) => {
  const solids = getSolids(shape.toGeometry());
  const shapes = [];
  for (const solid of solids) {
    const polygons = toPolygons({}, solid);
    const triangles = toTriangles({}, polygons);
    const paths = cutTrianglesByPlane({ allowOpenPaths }, fromPoints([0, 0, z], [1, 0, z], [0, 1, z]), triangles);
    shapes.push(Shape.fromPathsToZ0Surface(paths));
  }
  return assemble(...shapes);
};

const method = function (options) { return crossSection(options, this); };

Shape.prototype.crossSection = method;
