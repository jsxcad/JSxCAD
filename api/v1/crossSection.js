import { cutTrianglesByPlane, toTriangles } from '@jsxcad/algorithm-polygons';

import { Assembly } from './Assembly';
import { Solid } from './Solid';
import { Z0Surface } from './Z0Surface';
import { fromPoints } from '@jsxcad/math-plane';
import { toPolygons } from '@jsxcad/algorithm-solid';

export const crossSection = ({ z = 0 } = {}, shape) => {
  const geometry = shape.toSolid().toDisjointGeometry();
  const polygons = toPolygons({}, geometry.solid);
  const triangles = toTriangles({}, polygons);
  const paths = cutTrianglesByPlane(fromPoints([0, 0, z], [1, 0, z], [0, 1, z]), triangles);
  return Z0Surface.fromPaths(paths);
};

const method = function (options) { return crossSection(options, this); };

Assembly.prototype.crossSection = method;
Solid.prototype.crossSection = method;
