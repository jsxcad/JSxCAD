import { cutTrianglesByPlane, toTriangles } from '@jsxcad/algorithm-polygons';
import { fromPoints } from '@jsxcad/math-plane';
import { cube, union, writePdf } from '@jsxcad/api-v1';
import { union as unionOfZ0Polygons } from '@jsxcad/algorithm-z0polygons';

export const main = () => {
  const input = toTriangles({}, union(cube(30).translate([0, 0, 0]),
                                      cube(30).translate([5, 5, -1]),
                                      cube(30).translate([-5, -5, -1])
                                     ).toPaths({}));
  const paths = cutTrianglesByPlane(fromPoints([0, 0, 0], [1, 0, 0], [0, 1, 0]), input);
  const polygons = unionOfZ0Polygons(...paths.map(path => [path]));
  writePdf({ path: 'tmp/cutCubes.pdf' }, polygons);
}
