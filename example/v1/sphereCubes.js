import { assemble, cube, sphere, writeStl, writeSvgPhoto } from '@jsxcad/api-v1';

export const main = async () => {
  let x = assemble(sphere().as('a'),
                   cube().translate([0.5, 0.5, 0.5]).as('b'),
                   cube().translate([0.5, 0, 0]).as('c'));
  await writeStl({ path: 'tmp/sphereCubes.stl' }, x);
  await writeSvgPhoto({ path: 'tmp/sphereCubes.svg', view: { position: [0, 0, 6] } }, x.rotateX(-15).rotateY(-15));
  await writeSvgPhoto({ path: 'tmp/sphereCubesA.svg', view: { position: [0, 0, 6] } }, x.rotateX(-15).rotateY(-15).withComponents({ requires: ['a'] }));
};
