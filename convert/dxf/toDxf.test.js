import '@jsxcad/algorithm-cgal';

import { boot } from '@jsxcad/sys';
import fs from 'fs';
import test from 'ava';
import { toDxf } from './toDxf.js';

const { readFile, writeFile } = fs.promises;

test.beforeEach(async (t) => {
  await boot();
});

test('Triangle', async (t) => {
  const segments = [
    [
      [1, 0, 0],
      [-0.4999999999999998, 0.8660254037844387, 0],
    ],
    [
      [-0.4999999999999998, 0.8660254037844387, 0],
      [-0.5000000000000004, -0.8660254037844385, 0],
    ],
    [
      [-0.5000000000000004, -0.8660254037844385, 0],
      [1, 0, 0],
    ],
  ];
  const dxf = await toDxf({ tags: [], type: 'segments', segments });
  await writeFile('toDxf.out.triangle.dxf', dxf, { encoding: 'utf8' });
  t.is(dxf, await readFile('toDxf.test.triangle.dxf', { encoding: 'utf8' }));
});
