import { cutTrianglesByPlane, toTriangles } from '@jsxcad/algorithm-polygons';

import { Assembly } from './Assembly';
import { Solid } from './Solid';
import { Z0Surface } from './Z0Surface';
import { fromPoints } from '@jsxcad/math-plane';
import { toPolygons } from '@jsxcad/algorithm-solid';
import { union as unionZ0Surfaces } from '@jsxcad/algorithm-z0surface';
import { writeStl } from './writeStl';

export const crossSection = ({ z = 0 } = {}, shape) => {
  const geometry = shape.toSolid().toDisjointGeometry();
console.log(`QQ/crosssSection/geometry: ${JSON.stringify(geometry)}`);
console.log(`QQ/crosssSection/geometry/solid: ${JSON.stringify(geometry.solid)}`);
  // FIX: Why do we need to access solid[0]?
  const polygons = toPolygons({}, geometry.solid[0]);
console.log(`QQ/crosssSection/polygons: ${JSON.stringify(polygons)}`);
  const triangles = toTriangles({}, polygons);
console.log(`QQ/crosssSection/triangles: ${JSON.stringify(triangles)}`);
writeStl({ path: 'crossSection.stl' }, shape);
  const paths = cutTrianglesByPlane(fromPoints([0, 0, z], [1, 0, z], [0, 1, z]), triangles);
  return Z0Surface.fromPaths(paths);
};

const method = function (options) { return crossSection(options, this); };

Assembly.prototype.crossSection = method;
Solid.prototype.crossSection = method;
