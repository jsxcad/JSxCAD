const assembly = assemble(Cube(30).as('cube'),
                          Cylinder(5, 30).as('cylinder'));

await assembly.keep('cube').writeStl('stl/cube.stl');

// This should produce the cube with a hole in it filled by the cylinder.
await assembly.keep('cube', 'cylinder').writeStl('stl/cube-cylinder.stl');

// This should produce just the cylinder and no cube.
await assembly.keep('cylinder').writeStl('stl/cylinder.stl');

// This should produce a threejs page with the two distinct geometries together.
await assembly.writeThreejsPage({ cameraPosition: [0, 0, 120], path: 'html/assembly.html' });

return;
