import { createNormalize2 } from '@jsxcad/algorithm-quantize';
import { makeConvex } from './makeConvex';
import test from 'ava';

test('Box with hole', t => {
  const normalize = createNormalize2();
  const surface = [[[50, 50, 0], [-50, 50, 0], [-50, -50, 0], [50, -50, 0]], [[-5, -5, 0], [-5, 5, 0], [5, 5, 0], [5, -5, 0]]];
  const convexSurface = makeConvex(surface, normalize);
  t.deepEqual(convexSurface,
              [[[-50, 50, 0], [-50, -50, 0], [-5, -5, 0]],
               [[5, -5, 0], [-5, -5, 0], [-50, -50, 0]],
               [[-50, 50, 0], [-5, -5, 0], [-5, 5, 0]],
               [[5, -5, 0], [-50, -50, 0], [50, -50, 0]],
               [[50, 50, 0], [-50, 50, 0], [-5, 5, 0]],
               [[5, 5, 0], [5, -5, 0], [50, -50, 0]],
               [[50, 50, 0], [-5, 5, 0], [5, 5, 0]],
               [[5, 5, 0], [50, -50, 0], [50, 50, 0]]]);
});
