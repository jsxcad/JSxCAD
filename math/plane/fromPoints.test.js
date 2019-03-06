const test = require('ava');
const fromPoints = require('./fromPoints');

test('plane: fromPoints() should return a new plane with correct values', (t) => {
  t.deepEqual(fromPoints([0, 0, 0], [1, 0, 0], [1, 1, 0]), [0, 0, 1, 0]);
  t.deepEqual(fromPoints([0, 6, 0], [0, 2, 2], [0, 6, 6]), [-1, 0, 0, 0]);
});

test('plane: planes created from the same points results in an invalid plane', (t) => {
  t.deepEqual(fromPoints([0, 6, 0], [0, 6, 0], [0, 6, 0]), [0 / 0, 0 / 0, 0 / 0, 0 / 0]);
});

test('bad case', t => {
  t.deepEqual(fromPoints([-0.00003, -24.99999, -0.00005],
                         [-0.00001, -25, -0.00001],
                         [-0.00003, -24.99999, 0]),
              [-0.4472135954864135, -0.894427191006688, 0, 22.360684247303155]);
});
