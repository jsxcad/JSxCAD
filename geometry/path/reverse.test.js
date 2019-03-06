const equals = require('./equals');
const fromPoints = require('./fromPoints');
const reverse = require('./reverse');
const test = require('ava');

test('reverse: The reverse of a path has reversed points', t => {
  const points = [[0, 0, 0], [1, 1, 0]];
  t.false(equals(reverse(fromPoints({}, points)),
                 fromPoints({}, points)));
});
