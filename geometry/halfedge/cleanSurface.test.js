import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { fromSurfaceToCleanSurface } from './cleanSurface.js';
import test from 'ava';

const canonicalize = (solid) => JSON.parse(JSON.stringify(solid));

test('case #1', (t) => {
  const normalize = createNormalize3();
  const surface = [
    [
      [1, 0, -0.5],
      [0, 1, -0.5],
      [-1, 0, -0.5],
      [0, -1, -0.5],
    ],
  ];
  const cleanSurface = fromSurfaceToCleanSurface(surface, normalize);
  t.deepEqual(canonicalize(cleanSurface), [
    [
      [-1, 0, -0.5],
      [0, -1, -0.5],
      [1, 0, -0.5],
    ],
    [
      [1, 0, -0.5],
      [0, 1, -0.5],
      [-1, 0, -0.5],
    ],
  ]);
});
