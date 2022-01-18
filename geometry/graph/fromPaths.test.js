import { fromPaths } from './fromPaths.js';
import { initCgal } from '@jsxcad/algorithm-cgal';
import { serialized } from './serialized.js';
import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

test('fromPaths', (t) => {
  const paths = [
    [
      [-100, 100, 0],
      [-100, -100, 0],
      [100, -100, 0],
      [100, 100, 0],
    ],
    [
      [-5, 5, 0],
      [-5, -5, 0],
      [5, -5, 0],
      [5, 5, 0],
    ],
    [
      [-2, 2, 0],
      [-2, -2, 0],
      [2, -2, 0],
      [2, 2, 0],
    ],
  ];
  const geometry = fromPaths({}, paths);
  t.deepEqual(
    serialized(geometry),
    `12
-5 -5 0
-100 100 0
-100 -100 0
-5 5 0
5 5 0
100 -100 0
5 -5 0
100 100 0
2 -2 0
-2 2 0
-2 -2 0
2 2 0

10
3 2 0 1
3 1 3 4
3 2 5 6
3 1 4 7
3 1 0 3
3 4 6 5
3 4 5 7
3 6 0 2
3 10 8 9
3 9 8 11
`
  );
});
