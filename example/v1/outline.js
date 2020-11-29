const scene = assemble(
  Ball(10).as('sphere'),
  Box(10).front().right().above().as('cube'),
  Rod(3, 27).as('cylinder')
);

scene.keep('sphere').view().writeStl('stl/sphere.stl');

scene
  .keep('sphere')
  .section(Z(0.001))
  .outline()
  .view()
  .writePdf('pdf/sphere.pdf');

scene
  .keep('sphere', 'cube')
  .section(Z(0.001))
  .outline()
  .view()
  .writePdf('pdf/sphereCube.pdf');
