import { cube, cylinder, union, writeStl, writeThreejsPage } from '@jsxcad/api-v1';

export const main = () => {
  const assembly = union(cube({ size: 30, center: true }).as('cube'),
                         cylinder({ r: 5, h: 30, center: true }).as('cylinder'));

  // This should produce the cube with a hole in it for the cylinder that we decided not to display.
  writeStl({ path: 'tmp/assembly-cube.stl' }, assembly.toSolid({ tags: ['cube'] }));

  // This should produce the cube with a hole in it filled by the cylinder.
  writeStl({ path: 'tmp/assembly-cube-cylinder.stl' }, assembly.toSolid({ tags: ['cube', 'cylinder'] }));

  // This should produce just the cylinder and no cube.
  writeStl({ path: 'tmp/assembly-cylinder.stl' }, assembly.toSolid({ tags: ['cylinder'] }));

  // This should produce a threejs page with the two distinct geometries together.
  writeThreejsPage({ cameraPosition: [0, 0, 120], path: 'tmp/assembly.html' },
                   assembly.toSolid({ tags: ['cube'] }),
                   assembly.toSolid({ tags: ['cylinder'] }));
};
