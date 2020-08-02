const scene = assemble(
  Sphere(10).as('sphere'),
  Cube(10).front().right().above().as('cube'),
  Cylinder(3, 27).as('cylinder')
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
