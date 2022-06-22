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
        tags: ['color:#da38da'],
        graph: {
          serializedSurfaceMesh:
            '8\n2 2 0 200 200 0\n0 0 0 0 0 0\n1200 0 0 120000 0 0\n1198 2 0 119800 200 0\n1200 400 0 120000 40000 0\n1198 398 0 119800 39800 0\n0 400 0 0 40000 0\n2 398 0 200 39800 0\n\n8\n3 2 0 1\n3 3 0 2\n3 4 3 2\n3 5 3 4\n3 6 5 4\n3 7 5 6\n3 1 7 6\n3 0 7 1\n',
          hash: 'XCE6Lbh6Abgme1DM4G7qxJJoPRb6zv9DPeJaiHg9N7c=',
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
        tags: ['color:#ffff00'],
        graph: {
          serializedSurfaceMesh:
            '4\n400 300 0 40000 30000 0\n400 100 0 40000 10000 0\n800 100 0 80000 10000 0\n800 300 0 80000 30000 0\n\n2\n3 2 0 1\n3 0 2 3\n',
          hash: 'VDzYqa3kHUa7C2VImo6ZRuoNlIcUwyefOY/NF5fIuI0=',
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
        tags: ['color:#000037'],
        graph: {
          serializedSurfaceMesh:
            '8\n405 105 0 40500 10500 0\n395 95 0 39500 9500 0\n805 95 0 80500 9500 0\n795 105 0 79500 10500 0\n805 305 0 80500 30500 0\n795 295 0 79500 29500 0\n395 305 0 39500 30500 0\n405 295 0 40500 29500 0\n\n8\n3 2 0 1\n3 3 0 2\n3 4 3 2\n3 5 3 4\n3 6 5 4\n3 7 5 6\n3 1 7 6\n3 0 7 1\n',
          hash: 'DDTqXtifRsluvoILfqhf4SB7BoOx8hZ9LN3w/LX+22A=',
        },
      },
    ],
  });
});
