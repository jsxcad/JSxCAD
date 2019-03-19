import { difference, square, union, writePdf } from '@jsxcad/api-v1';

export const main = () =>
  writePdf({ path: 'tmp/squaresDifference.pdf' },
           difference(union(square(7).translate([-10, 0]),
                            square(7).translate([10, 0])),
                      square(5).translate([-10, 0]), square(5).translate([10, 0])));
