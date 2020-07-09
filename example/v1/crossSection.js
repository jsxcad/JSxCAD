const design = assemble(
  Sphere(10).as('sphere'),
  Cube(10).front().right().above().as('cube'),
  Cylinder(3, 27).as('cylinder')
);

design.section(Z(0)).outline().writePdf('pdf/crossSection.pdf');

design.cut(Z(0)).writeStl('stl/crossSection.stl');
