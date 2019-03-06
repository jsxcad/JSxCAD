const abs = require('./abs');
const test = require('ava');

test('vec2: abs() should return a vec2 with positive values', (t) => {
  const obs1 = abs([0, 0]);
  t.deepEqual(obs1, [0, 0]);

  const obs2 = abs([1, 2]);
  t.deepEqual(obs2, [1, 2]);

  const obs3 = abs([-1, -2]);
  t.deepEqual(obs3, [1, 2]);
});
