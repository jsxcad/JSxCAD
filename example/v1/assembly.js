import '@jsxcad/api-v1-stl';
import '@jsxcad/api-v1-threejs';

const assembly = Cube(30).as('cube').with(Cylinder(5, 30).as('cylinder'));

md`
Cube
`;
assembly.keep('cube').item().Page().view().writeStl('cube');

md`
Cube-Cylinder
`;
// This should produce the cube with a hole in it filled by the cylinder.
assembly.keep('cube', 'cylinder').item().view().writeStl('cube-cylinder');

md`
Cylinder
`;
// This should produce just the cylinder and no cube.
assembly.keep('cylinder').item().view().writeStl('cylinder');

md`
Assembly
`;
// This should produce a threejs page with the two distinct geometries together.
assembly.view().writeThreejsPage({
  cameraPosition: [0, 0, 120],
  path: 'html/assembly.html',
});

return;
