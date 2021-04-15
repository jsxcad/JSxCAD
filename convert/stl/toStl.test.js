import { boot } from '@jsxcad/sys';
import { fromPolygons } from '@jsxcad/geometry-graph';
import { readFileSync } from 'fs';
import { taggedGraph } from '@jsxcad/geometry-tagged';
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
  const stl = await toStl(taggedGraph({}, fromPolygons(box1Solid)));
  console.log(new TextDecoder('utf8').decode(stl));
  t.is(
    new TextDecoder('utf8').decode(stl),
    readFileSync('toStl.test.box.stl', { encoding: 'utf8' })
  );
});
