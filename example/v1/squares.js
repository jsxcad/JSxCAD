import { square, union, writePdf } from '@jsxcad/api-v1';

export const main = () =>
  writePdf({ path: 'tmp/squares.pdf' },
           union(square(30), square(30).translate([15, 15])));
