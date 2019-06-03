import { cube, difference, writeStl } from '@jsxcad/api-v1';

export const main = () =>
  writeStl({ path: 'tmp/cubes.stl' },
           difference(cube(10).right().back().above(),
                      cube(10).right().back().above().rotateY(45).rotateX(45)));
