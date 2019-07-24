let x = assemble(sphere().as('a'),
                 cube().translate([0.5, 0.5, 0.5]).as('b'),
                 cube().translate([0.5, 0, 0]).as('c'));

await x.writeStl('stl/sphereCubes.stl');

await x.writeSvgPhoto({ path: 'svg/sphereCubes.svg', view: { position: [6, 6, 6] } });
await x.keep('a').writeSvgPhoto({ path: 'svg/sphereCubesA.svg', view: { position: [-6, 6, 6] } });

/*
// Some rotations are producing repeated coordinates.
await x.rotateX(-15)
       .rotateY(-15)
       .keep('a')
       .writeSvgPhoto({ path: 'svg/sphereCubesA.svg', view: { position: [0, 0, 6] } });
*/
