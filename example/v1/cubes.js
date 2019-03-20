import { cube, difference } from '@jsxcad/api-v1';

export const main = () =>
  difference(cube(10),
             cube(10).rotateY(45).rotateX(45))
      .writeStl({ path: 'tmp/cubes.stl' });
