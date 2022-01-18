import { boot } from '@jsxcad/sys';
import { fromStl } from './fromStl.js';
import { prepareForSerialization } from '@jsxcad/geometry';
import { readFileSync } from 'fs';
import test from 'ava';

test('Read example', async (t) => {
  await boot();
  const stl = readFileSync('fromStl.test.box.stl');
  const geometry = await fromStl(stl);
  t.deepEqual(JSON.parse(JSON.stringify(prepareForSerialization(geometry))), {
    type: 'graph',
    tags: [],
    graph: {
      isClosed: true,
      isEmpty: false,
      isLazy: true,
      provenance: 'algorithm/cgal/fromSurfaceMeshToLazyGraph',
      serializedSurfaceMesh:
        '8\n' +
        '-5 -5 -5\n' +
        '-5 -5 5\n' +
        '-5 5 5\n' +
        '-5 5 -5\n' +
        '5 -5 -5\n' +
        '5 5 -5\n' +
        '5 5 5\n' +
        '5 -5 5\n' +
        '\n' +
        '12\n' +
        '3 2 0 1\n' +
        '3 3 0 2\n' +
        '3 6 4 5\n' +
        '3 7 4 6\n' +
        '3 7 0 4\n' +
        '3 1 0 7\n' +
        '3 6 3 2\n' +
        '3 5 3 6\n' +
        '3 5 0 3\n' +
        '3 4 0 5\n' +
        '3 6 1 7\n' +
        '3 2 1 6\n',
      hash: 'vWNWr5vSYcMT23UhkxIOStWY5Us4FkbArTy+W175zX0=',
    },
    cache: {
      boundingBox: [
        [-5.0000000000000036, -5.0000000000000036, -5.000000000000003],
        [5.0000000000000036, 5.0000000000000036, 5.000000000000003],
      ],
    },
  });
});
