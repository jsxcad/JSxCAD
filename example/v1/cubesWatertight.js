import { cube, difference, union, writeStl, writeThreejsPage } from '@jsxcad/api-v1';

// FIX: This produces a defective geometry with duplicate planes.

export const main = () => {
  writeStl({ path: 'tmp/cubesWatertight.stl' },
           difference(cube({ size: [10, 10, 10], center: true }),
                      cube({ size: [9, 9, 10], center: true })));
}
