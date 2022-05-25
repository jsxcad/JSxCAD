import { createByteFetcher, fetchHeader, fromDst } from './fromDst.js';

import { readFileSync } from 'fs';
import test from 'ava';

test('Fetch header', (t) => {
  const fetcher = createByteFetcher(readFileSync('test.dst'));
  const header = fetchHeader({}, fetcher);
  t.deepEqual(header, {
    label: 'Untitled',
    stitchCount: 92,
    colorCount: 3,
    positiveX: 4100,
    negativeX: 0,
    positiveY: 0,
    negativeY: 3100,
    deltaX: undefined,
    deltaY: undefined,
    previousFile: undefined,
    previousX: undefined,
    previousY: undefined,
  });
});

test('Read dst to z0paths', async (t) => {
  const paths = await fromDst(readFileSync('test.dst'));
  t.deepEqual(paths, {
    type: 'paths',
    paths: [
      [
        null,
        [1000, -2000],
        [1000, -1889],
        [1000, -1778],
        [1000, -1667],
        [1000, -1556],
        [1000, -1444],
        [1000, -1333],
        [1000, -1222],
        [1000, -1111],
        [1000, -1000],
      ],
      [
        null,
        [2500, -1000],
        [2500, -1111],
        [2500, -1222],
        [2500, -1333],
        [2500, -1444],
        [2500, -1556],
        [2500, -1667],
        [2500, -1778],
        [2500, -1889],
        [2500, -2000],
      ],
      [
        null,
        [2500, -2000],
        [2500, -2111],
        [2500, -2222],
        [2500, -2333],
        [2500, -2444],
        [2500, -2556],
        [2500, -2667],
        [2500, -2778],
        [2500, -2889],
        [2500, -3000],
      ],
      [
        null,
        [4000, -3000],
        [4000, -2889],
        [4000, -2778],
        [4000, -2667],
        [4000, -2556],
        [4000, -2444],
        [4000, -2333],
        [4000, -2222],
        [4000, -2111],
        [4000, -2000],
      ],
    ],
  });
});
