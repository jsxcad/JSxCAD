let x = assemble(
  Sphere().as('a'),
  Cube().translate([0.5, 0.5, 0.5]).as('b'),
  Cube().translate([0.5, 0, 0]).as('c')
);

x.view().writeStl('sphereCubes');

x.view().writeSvgPhoto({
  path: 'svg/sphereCubes.svg',
  view: { position: [6, 6, 6] },
});
x.keep('a')
  .view()
  .writeSvgPhoto({
    path: 'svg/sphereCubesA.svg',
    view: { position: [-6, 6, 6] },
  });
