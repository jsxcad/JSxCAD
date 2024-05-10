import { readFileSync, writeFileSync } from 'fs';

import { boot } from '@jsxcad/sys';
import { fromPolygonSoup } from '@jsxcad/geometry';
import test from 'ava';
import { toStl } from './toStl.js';

test.beforeEach(async (t) => {
  await boot();
});

const box1Solid = [
  {
    points: [
      [-5, -5, -5],
      [-5, -5, 5],
      [-5, 5, 5],
      [-5, 5, -5],
    ],
  },
  {
    points: [
      [5, -5, -5],
      [5, 5, -5],
      [5, 5, 5],
      [5, -5, 5],
    ],
  },
  {
    points: [
      [-5, -5, -5],
      [5, -5, -5],
      [5, -5, 5],
      [-5, -5, 5],
    ],
  },
  {
    points: [
      [-5, 5, -5],
      [-5, 5, 5],
      [5, 5, 5],
      [5, 5, -5],
    ],
  },
  {
    points: [
      [-5, -5, -5],
      [-5, 5, -5],
      [5, 5, -5],
      [5, -5, -5],
    ],
  },
  {
    points: [
      [-5, -5, 5],
      [5, -5, 5],
      [5, 5, 5],
      [-5, 5, 5],
    ],
  },
];

test('Correctly render a box', async (t) => {
  console.log(`QQ/toStl/test/1`);
  const stl = await toStl(fromPolygonSoup(box1Solid));
  console.log(`QQ/toStl/test/2`);
  writeFileSync('out.toStl.test.box.stl', stl, { encoding: 'utf8' });
  t.is(
    new TextDecoder('utf8').decode(stl),
    readFileSync('toStl.test.box.stl', { encoding: 'utf8' })
  );
});
