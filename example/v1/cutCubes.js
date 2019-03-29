import { cube, union, writePdf } from '@jsxcad/api-v1';

export const main = () => {
  const paths = union(cube(30).translate([0, 0, 0]),
                      cube(30).translate([5, 5, -1]),
                      cube(30).translate([-5, -5, -1]))
      .crossSection();

  writePdf({ path: 'tmp/cutCubes.pdf' }, paths);
};
