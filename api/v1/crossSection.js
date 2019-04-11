import { Assembly } from './Assembly';
import { CAG } from './CAG';
import { CSG } from './CSG';
import { cutTrianglesByPlane, toTriangles } from '@jsxcad/algorithm-polygons';
import { fromPoints } from '@jsxcad/math-plane';
import { union as unionOfZ0Polygons } from '@jsxcad/algorithm-z0polygons';
import { toPolygons } from '@jsxcad/algorithm-solid';

export const crossSection = ({ z = 0 } = {}, shape) => {
  const triangles = toTriangles({}, toPolygons({}, shape.toSolid()));
  const paths = cutTrianglesByPlane(fromPoints([0, 0, z], [1, 0, z], [0, 1, z]), triangles);
  const polygons = unionOfZ0Polygons(...paths.map(path => [path]));
  return CAG.fromPolygons(polygons);
};

const method = function (options) { return crossSection(options, this); };

Assembly.prototype.crossSection = method;
CSG.prototype.crossSection = method;
