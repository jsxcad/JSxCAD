import { fromPoints } from '@jsxcad/math-plane';
import { toGeneric } from '@jsxcad/algorithm-surface';
import { splitSurface } from './splitSurface';
import { test } from 'ava';

const square = [[1, 1, 0], [-1, 1, 0], [-1, -1, 0], [1, -1, 0]];

const vertical = [[1, 0, 1], [-1, 0, 1], [-1, 0, -1], [1, 0, 1]];

test('Split a square in half with a vertical plane.', t => {
  const plane = fromPoints(...vertical);
  const coplanarBack = [];
  const coplanarFront = [];
  const back = [];
  const front = [];
  splitSurface(plane, coplanarBack, coplanarFront, back, front, [square]);
  t.deepEqual(toGeneric(coplanarBack), []);
  t.deepEqual(toGeneric(coplanarFront), []);
  t.deepEqual(toGeneric(back), [[[[1, -1, 0], [1, 0, 0], [-1, 0, 0], [-1, -1, 0]]]]);
  t.deepEqual(toGeneric(front), [[[[1, 0, 0], [1, 1, 0], [-1, 1, 0], [-1, 0, 0]]]]);
});
