import { fromRotateXToTransform } from './transform.js';
import { initCgal } from './getCgal.js';
import { raycast } from './raycast.js';

import test from 'ava';

const computeDotProduct = ([x1, y1, z1], [x2, y2, z2]) =>
  x1 * x2 + y1 * y2 + z1 * z2;

const computeLength = (v) => Math.sqrt(computeDotProduct(v, v));

const normalize = (v) => {
  const l = computeLength(v);
  return [v[0] / l, v[1] / l, v[2] / l];
};

test.beforeEach(async (t) => {
  await initCgal();
});

test('Raycast box from box', (t) => {
  const points = [];
  const result = raycast(
    [
      {
        type: 'graph',
        matrix: fromRotateXToTransform(1 / 6),
        tags: [],
        graph: {
          serializedSurfaceMesh:
            '8\n5/2 -5/2 -5/2 2500 -2500 -2500\n5/2 5/2 -5/2 2500 2500 -2500\n-5/2 5/2 -5/2 -2500 2500 -2500\n-5/2 -5/2 -5/2 -2500 -2500 -2500\n5/2 -5/2 5/2 2500 -2500 2500\n5/2 5/2 5/2 2500 2500 2500\n-5/2 5/2 5/2 -2500 2500 2500\n-5/2 -5/2 5/2 -2500 -2500 2500\n\n12\n3 1 0 2\n3 0 3 2\n3 4 5 6\n3 7 4 6\n3 4 1 5\n3 1 4 0\n3 5 2 6\n3 2 5 1\n3 6 3 7\n3 3 6 2\n3 7 0 4\n3 0 7 3\n',
          hash: 'UCgf2fUqrPTO4gYcPFdTu4QfRSwO/zuPLAeB0P643sg=',
        },
      },
    ],
    {
      xStart: -5,
      xStride: 1,
      xSteps: 11,
      yStart: -5,
      yStride: 1,
      ySteps: 11,
      z: 10,
      points,
    }
  );
  t.true(result);
  // We expect 25 results in the form [elevation, normalX, normalY, normalZ, ...] iterating x then y.

  const light = [0, 0, 1];
  // We'll go through and compute the dot products.

  const cells = [];
  for (let nth = 0; nth < points.length; nth += 4) {
    const normal = normalize([
      points[nth + 1],
      points[nth + 2],
      points[nth + 3],
    ]);
    const dot = computeDotProduct(light, normal);
    if (cells.length % 12 === 0) {
      cells.push('\n');
    }
    if (dot < 0) {
      cells.push('_');
    } else if (dot < 0.6) {
      cells.push('<');
    } else {
      cells.push('>');
    }
  }

  t.is(
    cells.join(''),
    `
___________
___________
___________
__<<<>>>>__
__<<<>>>>__
__<<<>>>>__
__<<<>>>>__
__<<<>>>>__
___________
___________
___________`
  );
});
