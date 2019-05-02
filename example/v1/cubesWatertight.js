import { cube, difference, writeStl } from '@jsxcad/api-v1';
import { toSolidWithConvexSurfaces } from '@jsxcad/geometry-solid';

// FIX: This produces a defective geometry with duplicate planes.

export const main = () => {
  writeStl({ path: 'tmp/cubesWatertight.stl' },
           toSolidWithConvexSurfaces(
             {},
             difference(cube({ size: [10, 10, 10], center: true }),
                        cube({ size: [9, 9, 10], center: true })).toSolid()));
};
