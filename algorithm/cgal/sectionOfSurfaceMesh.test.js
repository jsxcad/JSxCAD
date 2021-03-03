import { fromPolygonsToSurfaceMesh } from './fromPolygonsToSurfaceMesh.js';
import { initCgal } from './getCgal.js';
import { sectionOfSurfaceMesh } from './sectionOfSurfaceMesh.js';
import test from 'ava';
import { unitRegularTetrahedronPolygons } from '@jsxcad/data-shape';

test.beforeEach(async (t) => {
  await initCgal();
});

test('Section of tetrahedron.', (t) => {
  const mesh = fromPolygonsToSurfaceMesh(unitRegularTetrahedronPolygons);
  const plane = [0, 0, 1, 0];
  const sections = sectionOfSurfaceMesh(mesh, [plane]);
  t.deepEqual(JSON.parse(JSON.stringify(sections)), [
    {
      points: [
        [0, -1, 0],
        [0, 1, 0],
        [-1, 0, 0],
      ],
      exactPoints: [
        ['0', '-1', '0'],
        ['0', '1', '0'],
        ['-1', '0', '0'],
      ],
      holes: [],
      plane: [0, 0, 1, 0],
    },
    {
      points: [
        [0, -1, 0],
        [1, 0, 0],
        [0, 1, 0],
      ],
      exactPoints: [
        ['0', '-1', '0'],
        ['1', '0', '0'],
        ['0', '1', '0'],
      ],
      holes: [],
      plane: [0, 0, 1, 0],
    },
  ]);
});
