import { cube, difference } from '@jsxcad/api-v1';

if (false)
difference(cube(10),
           cube(10).rotateY(45).rotateX(45))
    .writeStl({ path: '/tmp/cubes.stl' });

if (false)
difference(cube(10),
           cube(10).rotateX(1))
    .writeStl({ path: '/tmp/cubes.stl' });

difference(cube(10),
           cube(10).rotateX(1).translate([0,10,0]))
    .writeStl({ path: '/tmp/cubes.stl' });
