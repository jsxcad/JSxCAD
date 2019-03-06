const fromPoints = require('./fromPoints');
const test = require('ava');

test('poly3: fromPoints() should return a new poly3 with correct values', (t) => {
  const exp1 = [[0, 0, 0], [1, 0, 0], [1, 1, 0]];
  const obs1 = fromPoints([[0, 0, 0], [1, 0, 0], [1, 1, 0]]);
  t.deepEqual(obs1, exp1);

  const exp2 = [[1, 1, 0], [1, 0, 0], [0, 0, 0]];
  const obs2 = fromPoints([[1, 1, 0], [1, 0, 0], [0, 0, 0]]);
  t.deepEqual(obs2, exp2);
});
