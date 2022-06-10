import { boot } from '@jsxcad/sys';
import { fromStl } from './fromStl.js';
import { readFileSync } from 'fs';
import { serialize } from '@jsxcad/geometry';
import test from 'ava';

test('Read example', async (t) => {
  await boot();
  const stl = readFileSync('fromStl.test.box.stl');
  const geometry = await fromStl(stl);
  t.deepEqual(JSON.parse(JSON.stringify(serialize(geometry))), {
    type: 'graph',
    matrix: [
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      '1',
      '0',
      '0',
      '0',
      '0',
      '1',
      '0',
      '0',
      '0',
      '0',
      '1',
      '0',
      '1',
    ],
    tags: [],
    graph: {
      serializedSurfaceMesh:
        '8\n-5 -5 -5 -500 -500 -500\n-5 -5 5 -500 -500 500\n-5 5 5 -500 500 500\n-5 5 -5 -500 500 -500\n5 -5 -5 500 -500 -500\n5 5 -5 500 500 -500\n5 5 5 500 500 500\n5 -5 5 500 -500 500\n\n12\n3 2 0 1\n3 3 0 2\n3 6 4 5\n3 7 4 6\n3 7 0 4\n3 1 0 7\n3 6 3 2\n3 5 3 6\n3 5 0 3\n3 4 0 5\n3 6 1 7\n3 2 1 6\n',
      hash: 'Xf+HDjKXUlApxhlLYZRB67MYqGHl7Ev/Q0HiUolTgAA=',
    },
  });
});
