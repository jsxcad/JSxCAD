import { difference, sphere, writeSvg } from '@jsxcad/api-v1';
import { cutTrianglesByPlane, toTriangles } from '@jsxcad/algorithm-polygons';
import { toPolygons } from '@jsxcad/algorithm-solid';
import { fromPoints } from '@jsxcad/math-plane';

export const main = () => {
  const z = 0;
  const shape = difference(sphere(30), sphere(15));
  const triangles = toTriangles({}, toPolygons({}, shape.toSolid()));
  const paths = cutTrianglesByPlane(fromPoints([0, 0, z], [1, 0, z], [0, 1, z]), triangles);
  writeSvg({ path: 'tmp/cutSpheres.svg' }, paths);
  writeSvg({ path: 'tmp/sphere.svg' }, sphere(10));
};
