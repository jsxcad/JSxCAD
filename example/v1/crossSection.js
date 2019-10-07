await assemble(Sphere(10).as('sphere'),
               Cube(10).front().right().above().as('cube'),
               Cylinder(3, 27).as('cylinder'))
        .section({ z: 0.001 })
        .outline()
        .writePdf('pdf/crossSection.pdf');
