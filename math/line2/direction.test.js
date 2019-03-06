const { canonicalize } = require('@jsxcad/math-vec2');
const create = require('./create');
const direction = require('./direction');
const fromPoints = require('./fromPoints');
const test = require('ava');

test('line2: direction() should return proper direction', (t) => {
  const line1 = create();
  const dir1 = direction(line1);
  t.deepEqual(canonicalize(dir1), [1, -0]);

  const line2 = fromPoints([1, 0], [0, 1]);
  const dir2 = direction(line2);
  t.deepEqual(canonicalize(dir2), [-0.70711, 0.70711]);

  const line3 = fromPoints([0, 1], [1, 0]);
  const dir3 = direction(line3);
  t.deepEqual(canonicalize(dir3), [0.70711, -0.70711]);

  const line4 = fromPoints([0, 0], [6, 0]);
  const dir4 = direction(line4);
  t.deepEqual(canonicalize(dir4), [1, -0]);

  const line5 = fromPoints([-5, 5], [5, -5]);
  const dir5 = direction(line5);
  t.deepEqual(canonicalize(dir5), [0.70711, -0.70711]);
});
