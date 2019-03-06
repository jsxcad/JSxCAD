const { canonicalize } = require('@jsxcad/math-vec3');
const create = require('./create');
const fromPoints = require('./fromPoints');
const reverse = require('./reverse');
const test = require('ava');

test('line3: reverse() should return proper lines', (t) => {
  const line1 = create();
  let rev = reverse(line1);
  let pnt = rev[0];
  let dir = rev[1];
  t.deepEqual(pnt, [0, 0, 0]);
  t.deepEqual(canonicalize(dir), [-0, -0, -1]);

  const line2 = fromPoints([1, 0, 0], [0, 1, 0]);
  rev = reverse(line2);
  pnt = rev[0];
  dir = rev[1];
  t.deepEqual(pnt, [1, 0, 0]);
  t.deepEqual(canonicalize(dir), [0.70711, -0.70711, -0]);

  const line3 = fromPoints([0, 1, 0], [1, 0, 0]);
  rev = reverse(line3);
  pnt = rev[0];
  dir = rev[1];
  t.deepEqual(pnt, [0, 1, 0]);
  t.deepEqual(canonicalize(dir), [-0.70711, 0.70711, -0]);

  const line4 = fromPoints([0, 6, 0], [0, 0, 6]);
  rev = reverse(line4);
  pnt = rev[0];
  dir = rev[1];
  t.deepEqual(pnt, [0, 6, 0]);
  t.deepEqual(canonicalize(dir), [-0, 0.70711, -0.70711]);

  const line5 = fromPoints([-5, 5, 5], [5, -5, -5]);
  rev = reverse(line5);
  pnt = rev[0];
  dir = rev[1];
  t.deepEqual(pnt, [-5, 5, 5]);
  t.deepEqual(canonicalize(dir), [-0.57735, 0.57735, 0.57735]);
});
