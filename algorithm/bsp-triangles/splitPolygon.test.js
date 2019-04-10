import { fromPoints } from '@jsxcad/math-plane';
import { splitPolygon } from './splitPolygon';
import { test } from 'ava';

const square = [[1, 1, 0], [-1, 1, 0], [-1, -1, 0], [1, -1, 0]];
const vertical = [[1, 0, 1], [-1, 0, 1], [-1, 0, -1], [1, 0, 1]];

test('Split a square in half with a vertical plane.', t => {
  const plane = fromPoints(...vertical);
  const coplanarBack = [];
  const coplanarFront = [];
  const back = [];
  const front = [];
  splitPolygon(plane, coplanarBack, coplanarFront, back, front, square);
  t.deepEqual(coplanarBack, []);
  t.deepEqual(coplanarFront, []);
  t.deepEqual(back,
              [[[1, -1, 0], [1, 0, 0], [-1, -1, 0]],
               [[-1, 0, 0], [-1, -1, 0], [1, 0, 0]]]);
  t.deepEqual(front,
              [[[1, 0, 0], [1, 1, 0], [-1, 0, 0]],
               [[-1, 1, 0], [-1, 0, 0], [1, 1, 0]]]);
});
