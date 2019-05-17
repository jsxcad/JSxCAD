import { chainHull, circle, square, writeStl } from '@jsxcad/api-v1';

export const main = async () => {
  await writeStl({ path: 'tmp/chainHull.stl' },
                 chainHull(circle(10).translate([0, 0, -10]),
                           square(5),
                           circle(10).translate([0, 0, 10])));
};
