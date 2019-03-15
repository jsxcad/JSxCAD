const polygonsToStla = require('./polygonsToStla');
const test = require('ava');
const { readFileSync } = require('fs');

const box1Polygons =
  [
    [[-5, -5, -5], [-5, -5, 5], [-5, 5, 5], [-5, 5, -5]],
    [[5, -5, -5], [5, 5, -5], [5, 5, 5], [5, -5, 5]],
    [[-5, -5, -5], [5, -5, -5], [5, -5, 5], [-5, -5, 5]],
    [[-5, 5, -5], [-5, 5, 5], [5, 5, 5], [5, 5, -5]],
    [[-5, -5, -5], [-5, 5, -5], [5, 5, -5], [5, -5, -5]],
    [[-5, -5, 5], [5, -5, 5], [5, 5, 5], [-5, 5, 5]]
  ];

test('Correctly render a box', t => {
  t.is(polygonsToStla({}, box1Polygons), readFileSync('polygonsToStla.test.box.stl', { encoding: 'utf8' }));
});
