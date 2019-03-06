const fromValues = require('./fromValues');
const test = require('ava');

test('mat4: fromValues() should return a new mat4 with correct values', (t) => {
  const obs1 = fromValues(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
  t.deepEqual(obs1, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

  const exp1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  t.deepEqual(obs1, exp1);

  const obs2 = fromValues(0, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11, -12, -13, -14, -15);
  t.deepEqual(obs2, [0, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11, -12, -13, -14, -15]);
});
