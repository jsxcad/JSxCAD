import { cutTrianglesByPlane, toTriangles } from '@jsxcad/geometry-polygons';

import { Shape } from './Shape';
import { fromPoints } from '@jsxcad/math-plane';
import { toPolygons } from '@jsxcad/geometry-solid';

export const crossSection = ({ z = 0 } = {}, shape) => {
  const geometry = shape.toSolid().toDisjointGeometry();
  const polygons = toPolygons({}, geometry.solid);
  const triangles = toTriangles({}, polygons);
  const paths = cutTrianglesByPlane(fromPoints([0, 0, z], [1, 0, z], [0, 1, z]), triangles);
  return Shape.fromPathsToZ0Surface(paths);
};

const method = function (options) { return crossSection(options, this); };

Shape.prototype.crossSection = method;
