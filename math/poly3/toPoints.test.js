const test = require('ava');
const toPoints = require('./toPoints');

test('Exercise toPoints', t => {
  t.deepEqual(toPoints([[0, 0], [1, 1]]), [[0, 0], [1, 1]]);
});
