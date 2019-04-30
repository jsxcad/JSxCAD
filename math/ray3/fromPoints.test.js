import { canonicalize } from '@jsxcad/math-vec3';
import { fromPoints } from './fromPoints';
import { test } from 'ava';

test('line3: fromPoints() should return a new line3 with correct values', (t) => {
  let obs = fromPoints([0, 0, 0], [1, 0, 0]);
  let pnt = obs[0];
  let dir = obs[1];
  t.deepEqual(pnt, [0, 0, 0]);
  t.deepEqual(canonicalize(dir), [1, 0, 0]);

  obs = fromPoints([1, 0, 0], [0, 1, 0]);
  pnt = obs[0];
  dir = obs[1];
  t.deepEqual(pnt, [1, 0, 0]);
  t.deepEqual(canonicalize(dir), [-0.70711, 0.70711, 0]);

  obs = fromPoints([0, 1, 0], [1, 0, 0]);
  pnt = obs[0];
  dir = obs[1];
  t.deepEqual(pnt, [0, 1, 0]);
  t.deepEqual(canonicalize(dir), [0.70711, -0.70711, 0]);

  obs = fromPoints([0, 6, 0], [0, 0, 6]);
  pnt = obs[0];
  dir = obs[1];
  t.deepEqual(pnt, [0, 6, 0]);
  t.deepEqual(canonicalize(dir), [0, -0.70711, 0.70711]);

  // line3 created from the same points results in an invalid line3
  obs = fromPoints([0, 5, 0], [0, 5, 0]);
  pnt = obs[0];
  dir = obs[1];
  t.deepEqual(pnt, [0, 5, 0]);
  t.deepEqual(canonicalize(dir), [NaN, NaN, NaN]);
});
