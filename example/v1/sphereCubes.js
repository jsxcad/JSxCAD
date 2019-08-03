let x = assemble(Sphere().as('a'),
                 Cube().translate([0.5, 0.5, 0.5]).as('b'),
                 Cube().translate([0.5, 0, 0]).as('c'));

await x.writeStl('stl/sphereCubes.stl');

await x.writeSvgPhoto({ path: 'svg/sphereCubes.svg', view: { position: [6, 6, 6] } });
await x.keep('a').writeSvgPhoto({ path: 'svg/sphereCubesA.svg', view: { position: [-6, 6, 6] } });
