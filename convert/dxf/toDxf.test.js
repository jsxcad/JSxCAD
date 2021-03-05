import fs from 'fs';
import test from 'ava';
import { toDxf } from './toDxf.js';

const { readFile } = fs.promises;

test('Triangle', async (t) => {
  const path = [
    [1, 0, 0],
    [-0.4999999999999998, 0.8660254037844387, 0],
    [-0.5000000000000004, -0.8660254037844385, 0],
  ];
  const dxf = await toDxf({ type: 'paths', paths: [path] });
  t.is(dxf, await readFile('toDxf.test.triangle.dxf', { encoding: 'utf8' }));
});
