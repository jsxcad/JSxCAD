import { cutTrianglesByPlane, toTriangles } from '@jsxcad/algorithm-polygons';

import { Assembly } from './Assembly';
import { Surface } from './Surface';
import { Solid } from './Solid';
import { fromPoints } from '@jsxcad/math-plane';
import { toPolygons } from '@jsxcad/algorithm-solid';
import { union as unionOfZ0Surfaces } from '@jsxcad/algorithm-z0surface';

export const crossSection = ({ z = 0 } = {}, shape) => {
  const triangles = toTriangles({}, toPolygons({}, shape.toSolid()));
  const paths = cutTrianglesByPlane(fromPoints([0, 0, z], [1, 0, z], [0, 1, z]), triangles);
  const polygons = unionOfZ0Surfaces(...paths.map(path => [path]));
  return Surface.fromPolygons(polygons);
};

const method = function (options) { return crossSection(options, this); };

Assembly.prototype.crossSection = method;
Solid.prototype.crossSection = method;
