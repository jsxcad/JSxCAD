import { cube, difference } from '@jsxcad/api-v1';

if (true)
difference(cube(10),
           cube(10).rotateY(45).rotateX(45))
    .writeStl({ path: '/tmp/cubes.stl' });

if (false)
difference(cube(10),
           cube(10).rotateX(1))
    .writeStl({ path: '/tmp/cubes.stl' });

if (false)
difference(cube(10), cube(9))
    .writeStl({ path: '/tmp/cubes.stl' });
