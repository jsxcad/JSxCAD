import '@jsxcad/algorithm-cgal';

import { boot } from '@jsxcad/sys';
import { fromColladaToThreejs } from './fromColladaToThreejs.js';
import { fromThreejsToGeometry } from './fromThreejsToGeometry.js';
import { prepareForSerialization } from '@jsxcad/geometry';
import { readFileSync } from 'fs';
import test from 'ava';

test.beforeEach(async (t) => {
  await boot();
});

test('Simple import', async (t) => {
  const data = readFileSync('duck_triangles.dae');
  const threejs = await fromColladaToThreejs(data);
  const geometry = JSON.parse(
    JSON.stringify(
      prepareForSerialization(await fromThreejsToGeometry(threejs))
    )
  );
  t.deepEqual(geometry, {});
});
