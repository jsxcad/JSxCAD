const fromTranslation = require('./fromTranslation');
const test = require('ava');

test('mat4: fromTranslation() should return a new mat4 with correct values', (t) => {
  const obs1 = fromTranslation([2, 4, 6]);
  t.deepEqual(obs1, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 2, 4, 6, 1]);

  const obs2 = fromTranslation([-2, -4, -6]);
  t.deepEqual(obs2, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -2, -4, -6, 1]);
});
