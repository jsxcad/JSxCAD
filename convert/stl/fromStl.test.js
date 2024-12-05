import { identityMatrix, serialize } from '@jsxcad/geometry';

import { boot } from '@jsxcad/sys';
import { fromStl } from './fromStl.js';
import { readFileSync } from 'fs';
import test from 'ava';

test('Read example', async (t) => {
  await boot();
  const stl = readFileSync('fromStl.test.box.stl');
  const geometry = await fromStl(stl);
  t.deepEqual(JSON.parse(JSON.stringify(serialize(geometry))), {
    type: 'graph',
    matrix: identityMatrix,
    tags: [],
    graph: {
      serializedSurfaceMesh:
        '8\n-5 -5 5 -5000 -5000 5000\n-5 -5 -5 -5000 -5000 -5000\n-5 5 5 -5000 5000 5000\n-5 5 -5 -5000 5000 -5000\n5 5 -5 5000 5000 -5000\n5 -5 -5 5000 -5000 -5000\n5 5 5 5000 5000 5000\n5 -5 5 5000 -5000 5000\n\n12\n3 3 0 2\n3 1 0 3\n3 4 6 7\n3 5 4 7\n3 0 1 5\n3 0 5 7\n3 3 2 4\n3 2 6 4\n3 1 3 5\n3 5 3 4\n3 2 0 7\n3 2 7 6\n',
      hash: 'NLx/VRYNW8u7wmdjQZkvjTjwNs+4PbSuC/mm/R5KqTg=',
    },
  });
});
