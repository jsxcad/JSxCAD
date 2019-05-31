import { assemble, cube, cylinder, writeStl, writeThreejsPage } from '@jsxcad/api-v1';

export const main = async () => {
  const assembly = assemble(cube(30).as('cube'),
                            cylinder(5, 30).as('cylinder'));

  await writeStl({ path: 'tmp/assembly-cube.stl' }, assembly.keep('cube').drop('cylinder'));

  // This should produce the cube with a hole in it filled by the cylinder.
  await writeStl({ path: 'tmp/assembly-cube-cylinder.stl' }, assembly.keep('cube', 'cylinder'));

  // This should produce just the cylinder and no cube.
  await writeStl({ path: 'tmp/assembly-cylinder.stl' }, assembly.keep('cylinder'));

  // This should produce a threejs page with the two distinct geometries together.
  await writeThreejsPage({ cameraPosition: [0, 0, 120], path: 'tmp/assembly.html' }, assembly);
};
