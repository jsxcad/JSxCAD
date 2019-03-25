import { cube, sphere, writeStl, union } from '@jsxcad/api-v1';

export function main () {
  let x = union(sphere().as('a'),
                cube({ size: 1, center: true }).translate([0.5, 0.5, 0.5]).as('b').material('metal'),
                cube({ size: 1, center: true }).translate([0.5, 0, 0]).as('c'));

  writeStl({ path: 'tmp/sphereCubes.stl' },
             x.toPaths({ tags: ['a'] }),
             x.toPaths({ tags: ['b'] }),
             x.toPaths({ tags: ['c'] }))
}
