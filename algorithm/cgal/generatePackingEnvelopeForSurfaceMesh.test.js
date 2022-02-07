import { fromPolygonsToSurfaceMesh } from './fromPolygonsToSurfaceMesh.js';
import { generatePackingEnvelopeForSurfaceMesh } from './generatePackingEnvelopeForSurfaceMesh.js';
import { identity } from './transform.js';
import { initCgal } from './getCgal.js';
import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

test('triangle', (t) => {
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
  const polygons = generatePackingEnvelopeForSurfaceMesh(
    surfaceMesh,
    identity(),
    1,
    8,
    30
  );
  t.deepEqual(JSON.parse(JSON.stringify(polygons)), [
    {
      points: [
        [-1.5, -0.5, 0],
        [1.2073170731707317, -1.2073170731707317, 0],
        [0.2073170731707317, 1.2073170731707317, 0],
        [-1.2073170731707317, 1.2073170731707317, 0],
      ],
      exactPoints: [
        ['-3/2', '-1/2', '0'],
        ['99/82', '-99/82', '0'],
        ['17/82', '99/82', '0'],
        ['-99/82', '99/82', '0'],
      ],
      holes: [],
      plane: [0, 0, 1, 0],
    },
  ]);
});
