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
  t.deepEqual(back, [[[1, -1, 0], [1, 0, 0], [-1, 0, 0], [-1, -1, 0]]]);
  t.deepEqual(front, [[[1, 0, 0], [1, 1, 0], [-1, 1, 0], [-1, 0, 0]]]);
});

test('A debugging case', t => {
  const coplanarBack = [];
  const coplanarFront = [];
  const back = [];
  const front = [];
  splitPolygon([0.94352, -0.19473, 0.26804, 23.58808],
               coplanarBack, coplanarFront, back, front,
               [[-21.26625, 0, -13.14325], [-20.2255, 12.5, -7.7255], [-12.5, 7.7255, -20.2255]]);
  t.deepEqual(coplanarBack, []);
  t.deepEqual(coplanarFront, []);
  t.deepEqual(back, []);
  t.deepEqual(front, [[[-21.26625, 0, -13.14325], [-20.2255, 12.5, -7.7255], [-12.5, 7.7255, -20.2255]]]);
});
