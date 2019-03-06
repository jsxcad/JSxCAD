const clone = require('./clone');
const test = require('ava');

test('vec4: clone() should return a new vec4 with same values', (t) => {
  const org1 = [0, 0, 0, 0];
  const obs1 = clone(org1);
  t.deepEqual(obs1, [0, 0, 0, 0]);
  t.not(obs1, org1);

  const org2 = [1, 2, 3, 4];
  const obs2 = clone(org2);
  t.deepEqual(obs2, [1, 2, 3, 4]);
  t.not(obs2, org2);

  const org3 = [-1, -2, -3, -4];
  const obs3 = clone(org3);
  t.deepEqual(obs3, [-1, -2, -3, -4]);
  t.not(obs3, org3);
});
