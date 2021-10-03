import { computeCentroidOfSurfaceMesh } from './computeCentroidOfSurfaceMesh.js';
import { fromPolygonsToSurfaceMesh } from './fromPolygonsToSurfaceMesh.js';
import { identityMatrix } from '@jsxcad/math-mat4';
import { initCgal } from './getCgal.js';

import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

test('Triangle', (t) => {
  const triangle = [
    {
      points: [
        [-0.5, 0.5, 0.5],
        [-0.5, -0.5, 0.5],
        [0.5, -0.5, 0.5],
      ],
    },
  ];
  const surfaceMesh = fromPolygonsToSurfaceMesh(triangle);
  t.true(surfaceMesh.is_valid(false));
  t.true(!surfaceMesh.is_empty());
  const approximate = [];
  const exact = [];
  computeCentroidOfSurfaceMesh(surfaceMesh, identityMatrix, approximate, exact);
  t.deepEqual(
    { approximate, exact },
    {
      approximate: [-0.16666666666666666, -0.16666666666666666, 0.5],
      exact: ['-1/6', '-1/6', '1/2'],
    }
  );
});
