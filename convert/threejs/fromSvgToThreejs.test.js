import '@jsxcad/algorithm-cgal';

import { boot } from '@jsxcad/sys';
import { fromSvgToThreejs } from './fromSvgToThreejs.js';
import { fromThreejsToGeometry } from './fromThreejsToGeometry.js';
import { serialize } from '@jsxcad/geometry';
import test from 'ava';

test.beforeEach(async (t) => {
  await boot();
});

test('Simple import', async (t) => {
  const threejs = await fromSvgToThreejs(
    new TextEncoder('utf8').encode(`
    <?xml version="1.0"?>
    <svg width="12cm" height="4cm" viewBox="0 0 1200 400" xmlns="http://www.w3.org/2000/svg" version="1.2" baseProfile="tiny">
      <desc>Example rect01 - rectangle with sharp corners</desc>
      <!-- Show outline of canvas using 'rect' element -->
      <rect x="1" y="1" width="1198" height="398" style="fill:none;stroke:violet;stroke-width:2;"/>
      <rect x="400" y="100" width="400" height="200" fill="yellow" stroke="navy" stroke-width="10" />
    </svg>`)
  );
  const geometry = JSON.parse(
    JSON.stringify(serialize(await fromThreejsToGeometry(threejs)))
  );
  t.deepEqual(geometry, {
    type: 'group',
    tags: [],
    content: [
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
        tags: ['color:#b20ab2'],
        graph: {
          serializedSurfaceMesh:
            '8\n1200 0 0 1200000 0 0\n0 0 0 0 0 0\n2 2 0 2000 2000 0\n1198 2 0 1198000 2000 0\n1200 400 0 1200000 400000 0\n1198 398 0 1198000 398000 0\n0 400 0 0 400000 0\n2 398 0 2000 398000 0\n\n8\n3 5 3 0\n3 5 0 4\n3 5 6 7\n3 1 0 3\n3 4 6 5\n3 6 2 7\n3 6 1 2\n3 1 3 2\n',
          hash: 'U+TX0JDm8/+q7QaVOaQf6Wo/hO9Dngf6gLrpEHw53ME=',
        },
      },
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
        tags: ['color:#ffff00'],
        graph: {
          serializedSurfaceMesh:
            '4\n400 100 0 400000 100000 0\n400 300 0 400000 300000 0\n800 100 0 800000 100000 0\n800 300 0 800000 300000 0\n\n2\n3 1 2 3\n3 1 0 2\n',
          hash: 'vL4M2pgdYxRYPSqXCE6TBhH+h6PVL+tXLQf57UaSO0Q=',
        },
      },
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
        tags: ['color:#000009'],
        graph: {
          serializedSurfaceMesh:
            '8\n805 95 0 805000 95000 0\n395 95 0 395000 95000 0\n405 105 0 405000 105000 0\n795 105 0 795000 105000 0\n805 305 0 805000 305000 0\n795 295 0 795000 295000 0\n395 305 0 395000 305000 0\n405 295 0 405000 295000 0\n\n8\n3 5 3 0\n3 5 0 4\n3 5 6 7\n3 1 0 3\n3 4 6 5\n3 6 2 7\n3 6 1 2\n3 1 3 2\n',
          hash: 'V76Nojk23vX9zCIqFuqnPKVhN6XxvezXNYmNpnSoTAc=',
        },
      },
    ],
  });
});
