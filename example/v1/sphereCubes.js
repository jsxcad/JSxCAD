import { assemble, cube, sphere, writeStl } from '@jsxcad/api-v1';

export const main = async () => {
  let x = assemble(sphere().as('a'),
                   cube({ size: 1, center: true }).translate([0.5, 0.5, 0.5]).as('b'),
                   cube({ size: 1, center: true }).translate([0.5, 0, 0]).as('c'));
  await writeStl({ path: 'tmp/sphereCubes.stl' }, x);
};
