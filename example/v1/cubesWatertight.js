writeStl({ path: 'tmp/cubesWatertight.stl' },
         toSolidWithConvexSurfaces(
           {},
           difference(cube(10, 10, 10),
                      cube(9, 9, 10)).toSolid()));
