import { readFileSync } from 'fs';
import { test } from 'ava';
import { toStl } from './toStl';

const box1Solid =
  [
    [[[-5, -5, -5], [-5, -5, 5], [-5, 5, 5], [-5, 5, -5]]],
    [[[5, -5, -5], [5, 5, -5], [5, 5, 5], [5, -5, 5]]],
    [[[-5, -5, -5], [5, -5, -5], [5, -5, 5], [-5, -5, 5]]],
    [[[-5, 5, -5], [-5, 5, 5], [5, 5, 5], [5, 5, -5]]],
    [[[-5, -5, -5], [-5, 5, -5], [5, 5, -5], [5, -5, -5]]],
    [[[-5, -5, 5], [5, -5, 5], [5, 5, 5], [-5, 5, 5]]]
  ];

test('Correctly render a box', async t => {
  t.is(await toStl({}, { solid: box1Solid }), readFileSync('toStl.test.box.stl', { encoding: 'utf8' }));
});
