import '@jsxcad/algorithm-cgal';

import { boot } from '@jsxcad/sys';
import { fromSvgToThreejs } from './fromSvgToThreejs.js';
import { fromThreejsToGeometry } from './fromThreejsToGeometry.js';
import { prepareForSerialization } from '@jsxcad/geometry';
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
    JSON.stringify(
      prepareForSerialization(await fromThreejsToGeometry(threejs))
    )
  );
  t.deepEqual(geometry, {
    type: 'group',
    tags: [],
    content: [
      {
        type: 'graph',
        tags: ['color:#da38da'],
        graph: {
          isClosed: false,
          isEmpty: false,
          isLazy: true,
          provenance: 'algorithm/cgal/fromSurfaceMeshToLazyGraph',
          serializedSurfaceMesh:
            '8\n2 2 0\n0 0 0\n1200 0 0\n1198 2 0\n1200 400 0\n1198 398 0\n0 400 0\n2 398 0\n\n8\n3 2 0 1\n3 3 0 2\n3 4 3 2\n3 5 3 4\n3 6 5 4\n3 7 5 6\n3 1 7 6\n3 0 7 1\n',
          hash: 'r9H+HVi+0HPs0VLeLezF4obH6+WwmFfYe5Y7RRxiIMs=',
        },
        cache: {
          boundingBox: [
            [-2e-323, -2e-323, -2e-323],
            [1200.000000000001, 400.0000000000002, 1.5e-323],
          ],
        },
      },
      {
        type: 'graph',
        tags: ['color:#ffff00'],
        graph: {
          isClosed: false,
          isEmpty: false,
          isLazy: true,
          provenance: 'algorithm/cgal/fromSurfaceMeshToLazyGraph',
          serializedSurfaceMesh:
            '4\n400 300 0\n400 100 0\n800 100 0\n800 300 0\n\n2\n3 2 0 1\n3 0 2 3\n',
          hash: '3mM6ZWwRfUVOMX5w4EuWZSTy9nj4+kgfrPkapiNWz1Q=',
        },
        cache: {
          boundingBox: [
            [399.9999999999998, 99.99999999999994, -2e-323],
            [800.0000000000005, 300.0000000000002, 1.5e-323],
          ],
        },
      },
      {
        type: 'graph',
        tags: ['color:#000037'],
        graph: {
          isClosed: false,
          isEmpty: false,
          isLazy: true,
          provenance: 'algorithm/cgal/fromSurfaceMeshToLazyGraph',
          serializedSurfaceMesh:
            '8\n405 105 0\n395 95 0\n805 95 0\n795 105 0\n805 305 0\n795 295 0\n395 305 0\n405 295 0\n\n8\n3 2 0 1\n3 3 0 2\n3 4 3 2\n3 5 3 4\n3 6 5 4\n3 7 5 6\n3 1 7 6\n3 0 7 1\n',
          hash: 'aHtLQ0ODwARNHk8xyqPpTku3qlPgiehGkWTzQ3lYpTY=',
        },
        cache: {
          boundingBox: [
            [394.9999999999998, 94.99999999999994, -2e-323],
            [805.0000000000005, 305.0000000000002, 1.5e-323],
          ],
        },
      },
    ],
  });
});