const cross = require('./cross');
const test = require('ava');

test('vec3: cross() called with two paramerters should return a vec3 with correct values', (t) => {
  t.deepEqual(cross([0, 0, 0], [0, 0, 0]), [0, 0, 0]);
  t.deepEqual(cross([5, 5, 5], [10, 20, 30]), [50, -100, 50]);
  t.deepEqual(cross([5, 5, 5], [10, -20, 30]), [250, -100, -150]);
  t.deepEqual(cross([5, 5, 5], [-10, -20, 30]), [250, -200, -50]);
  t.deepEqual(cross([5, 5, 5], [-10, 20, 30]), [50, -200, 150]);
  t.deepEqual(cross([5, 5, 5], [10, 20, -30]), [-250, 200, 50]);
  t.deepEqual(cross([5, 5, 5], [10, -20, -30]), [-50, 200, -150]);
  t.deepEqual(cross([5, 5, 5], [-10, -20, -30]), [-50, 100, -50]);
  t.deepEqual(cross([5, 5, 5], [-10, 20, -30]), [-250, 100, 150]);
});
