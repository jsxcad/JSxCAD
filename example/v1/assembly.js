import { cube, cylinder, union, writeStl, writeSvg, writeThreejsPage } from '@jsxcad/api-v1';
import { retessellate } from '@jsxcad/algorithm-solid';
import { canonicalize } from '@jsxcad/algorithm-polygons';

export const main = () => {
  const assembly = union(cube({ size: 30, center: true }).as('cube'),
                         cylinder({ r: 5, h: 30, center: true, fn: 32 }).as('cylinder'));

  // This should produce the cube with a hole in it for the cylinder that we decided not to display.
  // writeStl({ path: 'tmp/assembly-cube.stl' }, assembly.toSolid({ tags: ['cube'] }));
  const surfaces = [];
  writeStl({ path: 'tmp/assembly-cube-retessellated.stl' }, retessellate({ emitSurface: (surface) => surfaces.push(surface) }, assembly.toSolid({ tags: ['cube'] })));
  for (let nth = 0; nth < surfaces.length; nth++) {
    writeSvg({ path: `tmp/assembly-cube-surface-${nth}.svg` }, surfaces[nth]);
  }
  return;

  // This should produce the cube with a hole in it filled by the cylinder.
  writeStl({ path: 'tmp/assembly-cube-cylinder.stl' }, assembly.toSolid({ tags: ['cube', 'cylinder'] }));

  // This should produce just the cylinder and no cube.
  writeStl({ path: 'tmp/assembly-cylinder.stl' }, assembly.toSolid({ tags: ['cylinder'] }));

  // This should produce a threejs page with the two distinct geometries together.
  writeThreejsPage({ cameraPosition: [0, 0, 120], path: 'tmp/assembly.html' },
                   assembly.toSolid({ tags: ['cube'] }),
                   assembly.toSolid({ tags: ['cylinder'] }));
};
