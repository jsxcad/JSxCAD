import { polygonsToStla } from './polygonsToStla';
import { readFileSync } from 'fs';
import { test } from 'ava';

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
