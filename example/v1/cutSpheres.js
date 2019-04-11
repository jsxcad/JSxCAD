import { difference, sphere, writePdf } from '@jsxcad/api-v1';
import { cutTrianglesByPlane, toTriangles } from '@jsxcad/algorithm-polygons';
import { fromPoints } from '@jsxcad/math-plane';
import { toPolygons } from '@jsxcad/algorithm-solid';

export const main = () => {
  const z = 0;
  const shape = difference(sphere(30), sphere(15));
  const triangles = toTriangles({}, toPolygons({}, shape.toSolid()));
  const paths = cutTrianglesByPlane(fromPoints([0, 0, z], [1, 0, z], [0, 1, z]), triangles);
  writePdf({ path: 'tmp/cutSpheres.pdf' }, paths);
};
