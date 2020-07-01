import fs from 'fs';
import test from 'ava';
import { toGcode } from './toGcode';
import { unitRegularTrianglePolygon } from '@jsxcad/data-shape';

const { readFile } = fs.promises;

test('Simple Triangle', async (t) => {
  const code = await toGcode(
    {},
    { type: 'paths', paths: [unitRegularTrianglePolygon] }
  );
  const expected = await readFile('simple_triangle.gcode', {
    encoding: 'utf8',
  });
  t.deepEqual(new TextDecoder('utf8').decode(code), expected);
});
