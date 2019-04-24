import { createByteFetcher, dstToZ0Paths, fetchHeader } from './dstToZ0Paths';

import { canonicalize } from '@jsxcad/algorithm-paths';
import { readFileSync } from 'fs';
import { test } from 'ava';

test('Fetch header', t => {
  const fetcher = createByteFetcher(readFileSync('test.dst'));
  const header = fetchHeader({}, fetcher);
  t.deepEqual(header,
              {
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
                previousY: undefined
              });
});

test('Read dst to z0paths', t => {
  const paths = canonicalize(dstToZ0Paths({}, readFileSync('test.dst')));
  t.deepEqual(paths,
              [[null, [100, -200, 0], [100, -188.9, 0], [100, -177.8, 0], [100, -166.7, 0], [100, -155.6, 0], [100, -144.4, 0], [100, -133.3, 0], [100, -122.2, 0], [100, -111.1, 0], [100, -100, 0]],
               [null, [250, -100, 0], [250, -111.1, 0], [250, -122.2, 0], [250, -133.3, 0], [250, -144.4, 0], [250, -155.6, 0], [250, -166.7, 0], [250, -177.8, 0], [250, -188.9, 0], [250, -200, 0]],
               [null, [250, -200, 0], [250, -211.1, 0], [250, -222.2, 0], [250, -233.3, 0], [250, -244.4, 0], [250, -255.6, 0], [250, -266.7, 0], [250, -277.8, 0], [250, -288.9, 0], [250, -300, 0]],
               [null, [400, -300, 0], [400, -288.9, 0], [400, -277.8, 0], [400, -266.7, 0], [400, -255.6, 0], [400, -244.4, 0], [400, -233.3, 0], [400, -222.2, 0], [400, -211.1, 0], [400, -200, 0]]]);
});
