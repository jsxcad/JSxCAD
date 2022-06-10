import '@jsxcad/algorithm-cgal';

import { readFileSync, writeFileSync } from 'fs';

import { boot } from '@jsxcad/sys';
import { fromColladaToThreejs } from './fromColladaToThreejs.js';
import { fromThreejsToGeometry } from './fromThreejsToGeometry.js';
import { serialize } from '@jsxcad/geometry';
import test from 'ava';

test.beforeEach(async (t) => {
  await boot();
});

test('Simple import', async (t) => {
  const data = readFileSync('duck_triangles.dae');
  const threejs = await fromColladaToThreejs(data);
  const geometry = JSON.parse(
    JSON.stringify(serialize(await fromThreejsToGeometry(threejs)))
  );
  writeFileSync('out.duck_triangles.json', JSON.stringify(geometry), 'utf8');
  const expectedGeometry = JSON.parse(
    readFileSync('duck_triangles.json', 'utf8')
  );
  t.deepEqual(geometry, expectedGeometry);
});
