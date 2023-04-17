import { computeToolpath } from './computeToolpath.js';
import { initCgal } from './getCgal.js';

import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

test('box', (t) => {
  const material = {
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
        '8\n20 0 0 20000 0 0\n20 10 0 20000 10000 0\n0 10 0 0 10000 0\n0 0 0 0 0 0\n20 0 10 20000 0 10000\n20 10 10 20000 10000 10000\n0 10 10 0 10000 10000\n0 0 10 0 0 10000\n\n12\n3 1 0 2\n3 0 3 2\n3 4 5 6\n3 7 4 6\n3 4 1 5\n3 1 4 0\n3 5 2 6\n3 2 5 1\n3 6 3 7\n3 3 6 2\n3 7 0 4\n3 0 7 3\n',
      hash: 'gnIM+vpjzJ3MPBxzXmBvk/2Pn48tIQjBxydO9ZFaxQI=',
    },
  };

  const model = {
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
        '12\n0 0 0 0 0 0\n0 0 7 0 0 7000\n0 10 0 0 10000 0\n0 10 7 0 10000 7000\n20 0 0 20000 0 0\n10 0 7 10000 0 7000\n10 0 10 10000 0 10000\n20 0 10 20000 0 10000\n20 10 0 20000 10000 0\n10 10 7 10000 10000 7000\n10 10 10 10000 10000 10000\n20 10 10 20000 10000 10000\n\n20\n3 3 0 1\n3 0 4 1\n3 2 4 0\n3 5 3 1\n3 2 0 3\n3 3 9 2\n3 9 3 5\n3 1 4 5\n3 7 4 8\n3 5 4 6\n3 5 6 9\n3 4 7 6\n3 11 6 7\n3 8 4 2\n3 11 8 2\n3 9 6 10\n3 6 11 10\n3 9 11 2\n3 10 11 9\n3 8 11 7\n',
      hash: 'NiXLqb/l1Ef+QDfiI4lTpHwoTvwonKUhNCJjYDPHUfg=',
    },
  };

  const [result] = computeToolpath(
    [model, material],
    /* materialStart= */ 1,
    /* resolution= */ 4,
    /* toolSize= */ 10,
    /* toolCutDepth= */ 1,
    /* annealingMax= */ 0.5,
    /* annealingMin= */ 0.1,
    /* annealingDecay= */ 0.1
  );

  // -2.5 + 7.5 = 5
  //  2.5 + 7.5 = 10

  t.deepEqual(result.segments, [
    [
      [2.000000000000001, 2.000000000000001, 18],
      [2.000000000000001, 2.000000000000001, 10],
      '2 2 18 2 2 10',
    ],
    [
      [2.000000000000001, 2.000000000000001, 10],
      [2.000000000000001, 6, 10],
      '2 2 10 2 6 10',
    ],
    [[2.000000000000001, 6, 10], [2.000000000000001, 10, 10], '2 6 10 2 10 10'],
    [[0, 0, 18], [0, 0, 0], '0 0 18 0 0 0'],
  ]);
});
