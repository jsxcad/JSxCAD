import { difference, square, union, writePdf } from '@jsxcad/api-v1';

writePdf({ path: '/tmp/squaresUnion.pdf' },
         union(difference(square(10), square(9)).translate([-2, -2]),
               difference(square(10), square(9)).translate([2, 2])));
