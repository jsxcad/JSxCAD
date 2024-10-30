import { staticDisplay } from './staticDisplay.js';

import test from 'ava';

Error.stackTraceLimit = Infinity;

test('Render Cube', async (t) => {
  const box = 
      {
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
          '1 0 0 0 0 1 0 0 0 0 1 0 1',
        ],
        tags: [],
        graph: {
          serializedSurfaceMesh:
            '8\n5/2 -5/2 -5/2 2500 -2500 -2500\n5/2 5/2 -5/2 2500 2500 -2500\n-5/2 5/2 -5/2 -2500 2500 -2500\n-5/2 -5/2 -5/2 -2500 -2500 -2500\n5/2 -5/2 5/2 2500 -2500 2500\n5/2 5/2 5/2 2500 2500 2500\n-5/2 5/2 5/2 -2500 2500 2500\n-5/2 -5/2 5/2 -2500 -2500 2500\n\n12\n3 1 0 2\n3 0 3 2\n3 4 5 6\n3 7 4 6\n3 4 1 5\n3 1 4 0\n3 5 2 6\n3 2 5 1\n3 6 3 7\n3 3 6 2\n3 7 0 4\n3 0 7 3\n',
          hash: 'UCgf2fUqrPTO4gYcPFdTu4QfRSwO/zuPLAeB0P643sg=',
        },
      };
  const { canvas, renderer } = await staticDisplay({ geometry: box }, { offsetWidth: 200, offsetHeight: 200 });
  t.true(false);
});
