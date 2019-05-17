import { assemble, cube, cylinder, writeStl, writeThreejsPage } from '@jsxcad/api-v1';

export const main = async () => {
  const assembly = assemble(cube({ size: 30, center: true }).as('cube'),
                            cylinder({ r: 5, h: 30, center: true, fn: 32 }).as('cylinder'));

  await writeStl({ path: 'tmp/assembly-cube.stl' }, assembly.withComponents({ requires: ['cube'], excludes: ['cylinder'] }));

  // This should produce the cube with a hole in it filled by the cylinder.
  await writeStl({ path: 'tmp/assembly-cube-cylinder.stl' }, assembly.withComponents({ requires: ['cube', 'cylinder'] }));

  // This should produce just the cylinder and no cube.
  await writeStl({ path: 'tmp/assembly-cylinder.stl' }, assembly.withComponents({ requires: ['cylinder'] }));

  // This should produce a threejs page with the two distinct geometries together.
  await writeThreejsPage({ cameraPosition: [0, 0, 120], path: 'tmp/assembly.html' }, assembly);
};
