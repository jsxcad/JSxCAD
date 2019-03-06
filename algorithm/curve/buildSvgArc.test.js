const buildSvgArc = require('./buildSvgArc');
const test = require('ava');

// TODO: More comprehensive test cases.

test('Flat arc', t => {
  t.deepEqual(buildSvgArc({}, [0, 0], [1, 1]),
              [[0, 0], [1, 1]]);
});

test('Half circle, small arc', t => {
  t.deepEqual(buildSvgArc({ resolution: 6, large: false, xRadius: 0.5, yRadius: 0.5 }, [1, 1], [2, 2]),
              [[1, 1],
               [1.5, 0.79289],
               [2, 1],
               [2.20711, 1.5],
               [2, 2]]);
});

test('Half circle, large arc', t => {
  t.deepEqual(buildSvgArc({ resolution: 6, large: true, xRadius: 0.5, yRadius: 0.5 }, [1, 1], [2, 2]),
              [[1, 1],
               [1.5, 0.79289],
               [2, 1],
               [2.20711, 1.5],
               [2, 2]]);
});

test('Quarter circle', t => {
  t.deepEqual(buildSvgArc({ resolution: 6, large: false, xRadius: 1, yRadius: 1 }, [1, 1], [2, 2]),
              [[1, 1],
               [1.5, 1.13397],
               [1.86603, 1.5],
               [2, 2]]);
});

test('Three-quarter circle', t => {
  t.deepEqual(buildSvgArc({ resolution: 6, large: true, xRadius: 1, yRadius: 1 }, [1, 1], [2, 2]),
              [[1, 1],
               [1.29289, 0.29289],
               [2, 0],
               [2.70711, 0.29289],
               [3, 1],
               [2.70711, 1.70711],
               [2, 2]]);
});
