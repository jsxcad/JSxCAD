const makeConvex = require('./makeConvex');
const test = require('ava');

test('Simple triangulation', t => {
  const convex = makeConvex({}, [[[0, -2], [2, -2], [2, 0], [1, -1], [0, -1]]]);
  const expected = [[[1, -1], [2, -2], [2, 0]],
                    [[0, -1], [2, -2], [1, -1]],
                    [[2, -2], [0, -1], [0, -2]]];
  expected.isConvex = true;
  t.deepEqual(convex, expected);
});
