const canonicalize = require('./canonicalize');
const clone = require('./clone');
const fromPointAndDirection = require('./fromPointAndDirection');
const test = require('ava');

test('line3: clone() should return a new line3 with same values', (t) => {
  const org1 = fromPointAndDirection([0, 0, 0], [1, 0, 0]);
  const obs1 = clone(org1);
  t.deepEqual(canonicalize(obs1), [[0, 0, 0], [1, 0, 0]]);
  t.not(obs1, org1);

  const org2 = fromPointAndDirection([1, 2, 3], [1, 0, 1]);
  const obs2 = clone(org2);
  t.deepEqual(canonicalize(obs2), [[1, 2, 3], [0.70711, 0, 0.70711]]);
  t.not(obs2, org2);

  const org3 = fromPointAndDirection([-1, -2, -3], [0, -1, -1]);
  const obs3 = clone(org3);
  t.deepEqual(canonicalize(obs3), [[-1, -2, -3], [0, -0.70711, -0.70711]]);
  t.not(obs3, org3);
});
