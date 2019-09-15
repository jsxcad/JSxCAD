import { retessellate } from './retessellate';
import test from 'ava';

// A box with triangles on each edge.
const center = [[-5, -5, 0], [5, -5, 0], [5, 5, 0], [-5, 5, 0]];
const right = [[5, -5, 0], [8, 0, 0], [5, 5, 0]];
const left = [[-5, 5, 0], [-8, 0, 0], [-5, -5, 0]];
const top = [[-5, 5, 0], [5, 5, 0], [0, 8, 0]];
const bottom = [[5, -5, 0], [-5, -5, 0], [0, -8, 0]];

test('all together', (t) => {
  const r = retessellate([center, right, left, top, bottom]);
  t.deepEqual(r, [[[5, -5], [8, 0], [5, 5], [0, 8], [-5, 5], [-8, 0], [-5, -5], [0, -8]]]);
});

test('left and right', (t) => {
  const r = retessellate([right, left]);
  t.deepEqual(r, [[[-5, 5], [-8, 0], [-5, -5]], [[8, 0], [5, 5], [5, -5]]]);
});

test('top and right', (t) => {
  const r = retessellate([top, left]);
  t.deepEqual(r, [[[-5, 5], [-8, 0], [-5, -5]], [[5, 5], [0, 8], [-5, 5]]]);
});

test('overlapping', t => {
  const a = [[0, -5, 0], [10, -5, 0], [10, 5, 0], [0, 5, 0]];
  const b = [[0, -5, 0], [10, -5, 0], [10, 5, 0], [0, 5, 0]];
  const r = retessellate([a, b]);
  // This is producing duplicates
  t.deepEqual(r, [[[10, -5], [10, 5], [0, 5], [0, -5]], [[10, -5], [10, 5], [0, 5], [0, -5]]]);
});
