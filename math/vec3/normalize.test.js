const c = require('./canonicalize');
const normalize = require('./normalize');
const test = require('ava');

test('vec3: normalize() called with one paramerters should return a vec3 with correct values', (t) => {
  t.deepEqual(c(normalize([0, 0, 0])), [0, 0, 0]);
  t.deepEqual(c(normalize([1, 2, 3])), [0.26726, 0.53452, 0.80178]);
  t.deepEqual(c(normalize([-1, -2, -3])), [-0.26726, -0.53452, -0.80178]);
  t.deepEqual(c(normalize([-1, 2, -3])), [-0.26726, 0.53452, -0.80178]);
});
