import { fromSolidToJunctions, junctionSelector } from './junction.js';

import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { fromSurfaceToCleanSurface } from './cleanSurface.js';
import test from 'ava';

test('case #1', (t) => {
  const normalize = createNormalize3();
  const surface = [
    [
      // [1, 0, -0.5],
      // [6.123233995736766e-17, 1, -0.5],
      // [-1, 1.2246467991473532e-16, -0.5],
      // [-1.8369701987210297e-16, -1, -0.5],
      [1, 0, -0.5],
      [0, 1, -0.5],
      [-1, 0, -0.5],
      [0, -1, -0.5],
    ],
  ];
  const cleanSurface = fromSurfaceToCleanSurface(surface, normalize);
  t.deepEqual(cleanSurface, []);
});
