const rotateX = require('./rotateX');
const test = require('ava');

const radians = 90 * Math.PI / 180;

test('vec3: rotateX() called with two paramerters should return a vec3 with correct values', (t) => {
  t.deepEqual(rotateX(0, [0, 0, 0], [0, 0, 0]), [0, 0, 0]);
  t.deepEqual(rotateX(0, [1, 2, 3], [3, 2, 1]), [3, 2, 1]);
  t.deepEqual(rotateX(radians, [1, 2, 3], [-1, -2, -3]), [-1, 8, -1]);
  t.deepEqual(rotateX(-radians, [-1, -2, -3], [1, 2, 3]), [1, 4, -7]);
});
