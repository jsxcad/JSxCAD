import { toStla } from './toStla';
import { readFileSync } from 'fs';
import { test } from 'ava';

const box1Solid =
  [
    [[[-5, -5, -5], [-5, -5, 5], [-5, 5, 5], [-5, 5, -5]]],
    [[[5, -5, -5], [5, 5, -5], [5, 5, 5], [5, -5, 5]]],
    [[[-5, -5, -5], [5, -5, -5], [5, -5, 5], [-5, -5, 5]]],
    [[[-5, 5, -5], [-5, 5, 5], [5, 5, 5], [5, 5, -5]]],
    [[[-5, -5, -5], [-5, 5, -5], [5, 5, -5], [5, -5, -5]]],
    [[[-5, -5, 5], [5, -5, 5], [5, 5, 5], [-5, 5, 5]]]
  ];

test('Correctly render a box', t => {
  t.is(toStla({}, { solid: box1Solid }), readFileSync('toStla.test.box.stl', { encoding: 'utf8' }));
});
