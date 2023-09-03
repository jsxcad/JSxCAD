import { initCgal } from './getCgal.js';
// import { reconstruct } from './reconstruct.js';

import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

/*
  test('box', (t) => {
    const box = {
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

    const [reconstruction] = reconstruct([box]);

    console.log(JSON.stringify(reconstruction));
    t.true(false);
  });
*/

test('true', (t) => t.true(true));
