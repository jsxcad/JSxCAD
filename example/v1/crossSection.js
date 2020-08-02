const design = assemble(
  Sphere(10).as('sphere'),
  Cube(10).front().right().above().as('cube'),
  Cylinder(3, 27).as('cylinder')
);

design.section(Z(0)).outline().view().writePdf('pdf/crossSection.pdf');

design.cut(Z(0)).view().writeStl('stl/crossSection.stl');
