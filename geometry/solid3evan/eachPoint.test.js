const eachPoint = require('./eachPoint');
const fromPolygons = require('./fromPolygons');
const test = require('ava');

// a simple triangle
const triangle = [[0, 0, 0], [0, 1, 0], [0, 1, 1]];

test('eachPoint emits each point', t => {
  const collected = [];
  eachPoint({}, point => collected.push(point), fromPolygons({}, [triangle]));
  t.deepEqual(collected, triangle);
});
