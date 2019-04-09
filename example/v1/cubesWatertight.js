import { cube, difference, union, writeStl, writeThreejsPage } from '@jsxcad/api-v1';
import { retessellate } from '@jsxcad/algorithm-solid';

// FIX: This produces a defective geometry with duplicate planes.

export const main = () => {
  writeStl({ path: 'tmp/cubesWatertight.stl' },
           retessellate({},
                        difference(cube({ size: [10, 10, 10], center: true }),
                                   cube({ size: [9, 9, 10], center: true })).toSolid()));
}
