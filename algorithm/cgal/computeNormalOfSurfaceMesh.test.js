import { computeNormalOfSurfaceMesh } from './computeNormalOfSurfaceMesh.js';
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
  computeNormalOfSurfaceMesh(surfaceMesh, identityMatrix, approximate, exact);
  t.deepEqual(
    { approximate, exact },
    {
      approximate: [-1.6653345369377343e-16, -1.6653345369377343e-16, 1],
      exact: [
        '-3377699720527871/20282409603651670423947251286016',
        '-3377699720527871/20282409603651670423947251286016',
        '1',
      ],
    }
  );
});
