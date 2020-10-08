import {
  unitCubePolygons,
  unitRegularTetrahedronPolygons,
} from '@jsxcad/data-shape';

import { fromNefPolyhedronToGraph } from './fromNefPolyhedronToGraph2.js';
import { fromPolygonsToSurfaceMesh } from './fromPolygonsToSurfaceMesh.js';
import { fromSurfaceMeshToNefPolyhedron } from './fromSurfaceMeshToNefPolyhedron.js';
import { initCgal } from './getCgal.js';
import { sectionOfNefPolyhedron } from './sectionOfNefPolyhedron.js';
import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

test('Section of tetrahedron.', (t) => {
  const aNef = fromSurfaceMeshToNefPolyhedron(
    fromPolygonsToSurfaceMesh(unitRegularTetrahedronPolygons)
  );
  const sectionNef = sectionOfNefPolyhedron(aNef, 0, 0, 1, 0);
  const graph = fromNefPolyhedronToGraph(sectionNef);
  t.deepEqual(JSON.parse(JSON.stringify(graph)), {});
});

test('Section of cube.', (t) => {
  console.log(`QQ/1`);
  const aNef = fromSurfaceMeshToNefPolyhedron(
    fromPolygonsToSurfaceMesh(unitCubePolygons)
  );
  console.log(`QQ/2`);
  const sectionNef = sectionOfNefPolyhedron(aNef, 0, 0, 1, 0);
  console.log(`QQ/3`);
  const graph = fromNefPolyhedronToGraph(sectionNef);
  console.log(`QQ/4`);
  t.deepEqual(JSON.parse(JSON.stringify(graph)), {});
  console.log(`QQ/5`);
});
