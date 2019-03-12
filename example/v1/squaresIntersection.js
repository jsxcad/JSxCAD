import { difference, intersection, square, writePdf } from '@jsxcad/api-v1';

writePdf({ path: '/tmp/squaresIntersection.pdf' },
         intersection(difference(square(10), square(9)).translate([-2, -2]),
                      difference(square(10), square(9)).translate([2, 2])));
