import { buildRegularPolygon } from '@jsxcad/algorithm-shape';
import fs from 'fs';
import test from 'ava';
import { toDxf } from './toDxf';

const { readFile } = fs.promises;

test('Triangle', async (t) => {
  const path = buildRegularPolygon(3).z0Surface[0];
  const dxf = await toDxf({}, { paths: [path] });
  t.is(dxf, await readFile('toDxf.test.triangle.dxf', { encoding: 'utf8' }));
});
