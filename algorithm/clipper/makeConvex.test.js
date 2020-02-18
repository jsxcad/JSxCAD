import { boot } from '@jsxcad/sys';
import { createNormalize2 } from '@jsxcad/algorithm-quantize';
import { isCounterClockwise } from '@jsxcad/geometry-path';
import { flip } from '@jsxcad/geometry-paths';
import { makeConvex } from './makeConvex';
import test from 'ava';

test.beforeEach(async t => { await boot(); });

test('Box with hole', t => {
  const normalize = createNormalize2();
  const surface = [[[50, 50, 0], [-50, 50, 0], [-50, -50, 0], [50, -50, 0]], [[-5, -5, 0], [-5, 5, 0], [5, 5, 0], [5, -5, 0]]];
  const convexSurface = makeConvex(surface, normalize);
  t.deepEqual(convexSurface,
              [[[-50, 50, 0], [-50, -50, 0], [-5, -5, 0]], [[5, -5, 0], [-5, -5, 0], [-50, -50, 0]], [[-50, 50, 0], [-5, -5, 0], [-5, 5, 0]], [[5, -5, 0], [-50, -50, 0], [50, -50, 0]], [[50, 50, 0], [-50, 50, 0], [-5, 5, 0]], [[5, 5, 0], [5, -5, 0], [50, -50, 0]], [[50, 50, 0], [-5, 5, 0], [5, 5, 0]], [[5, 5, 0], [50, -50, 0], [50, 50, 0]]]);
});

test('makeConvex returns an empty surface from an upside down one', t => {
  const normalize = createNormalize2();
  const surface = [[[0.5,-0.5,0],[0.5,0.5,0],[-0.5,0.5,0],[-0.5,-0.5,0]],
                   [[-1,1,0],[1,1,0],[1,-1,0],[-1,-1,0]]];
  const convexSurface = makeConvex(surface, normalize);
  t.true(isCounterClockwise(surface[0]));
  t.false(isCounterClockwise(surface[1]));
  t.deepEqual(convexSurface, []);
});

test('makeConvex returns an empty surface', t => {
  const normalize = createNormalize2();
  const surface = flip([[[0.5,-0.5,0],[0.5,0.5,0],[-0.5,0.5,0],[-0.5,-0.5,0]],
                        [[-1,1,0],[1,1,0],[1,-1,0],[-1,-1,0]]]);
  const convexSurface = makeConvex(surface, normalize);
  t.false(isCounterClockwise(surface[0]));
  t.true(isCounterClockwise(surface[1]));
  t.deepEqual(convexSurface, []);
});
