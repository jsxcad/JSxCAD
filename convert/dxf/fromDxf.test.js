import fromDxf from './fromDxf.js';
import fs from 'fs';
import test from 'ava';

const { readFile } = fs.promises;

test('Basic', async (t) => {
  const geometry = await fromDxf(
    await readFile('toDxf.test.triangle.dxf', { encoding: 'utf8' })
  );
  t.deepEqual(geometry, {
    type: 'assembly',
    content: [
      {
        type: 'paths',
        paths: [
          [
            null,
            [1.0000000000000009, 0, 0],
            [-0.5000000000000002, 0.8660254037844388, 0],
          ],
        ],
        tags: ['user:dxf:handle:16', 'user:dxf:layer:0', 'color:#ffffff'],
      },
      {
        type: 'paths',
        paths: [
          [
            null,
            [-0.5000000000000002, 0.8660254037844388, 0],
            [-0.5000000000000007, -0.8660254037844386, 0],
          ],
        ],
        tags: ['user:dxf:handle:17', 'user:dxf:layer:0', 'color:#ffffff'],
      },
      {
        type: 'paths',
        paths: [
          [
            null,
            [-0.5000000000000007, -0.8660254037844386, 0],
            [1.0000000000000009, 0, 0],
          ],
        ],
        tags: ['user:dxf:handle:18', 'user:dxf:layer:0', 'color:#ffffff'],
      },
    ],
  });
});
