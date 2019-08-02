const scene = assemble(Sphere(10).as('sphere'),
                       Cube(10).front().right().above().as('cube'),
                       Cylinder(3, 27).as('cylinder'));

await scene.keep('sphere')
           .writeStl('stl/sphere.stl');

await scene.keep('sphere').section().outline()
           .writePdf('pdf/sphere.pdf');

await scene.keep('sphere', 'cube').section().outline() 
           .writePdf('pdf/sphereCube.pdf');
