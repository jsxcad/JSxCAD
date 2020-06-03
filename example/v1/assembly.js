import '@jsxcad/api-v1-stl';
import '@jsxcad/api-v1-threejs';

const assembly = Cube(30)
                   .as('cube')
                   .with(Cylinder(5, 30)
                           .as('cylinder'));

await assembly.keep('cube').Item().Page().writeStl('cube');

// This should produce the cube with a hole in it filled by the cylinder.
await assembly.keep('cube', 'cylinder').Item().writeStl('cube-cylinder');

// This should produce just the cylinder and no cube.
await assembly.keep('cylinder').Item().writeStl('cylinder');

// This should produce a threejs page with the two distinct geometries together.
await assembly.writeThreejsPage({ cameraPosition: [0, 0, 120], path: 'html/assembly.html' });

return;
