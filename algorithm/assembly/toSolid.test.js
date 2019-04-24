import { canonicalize, fromPolygons } from '@jsxcad/algorithm-solid';
import { unitCubePolygons, unitRegularTriangularPrismPolygons } from '@jsxcad/data-shape';

import { solidToStla } from '@jsxcad/convert-stl';
import { test } from 'ava';
import { toSolid } from './toSolid';
import { writeFileSync } from 'fs';

/*
FIX: Produces defective geometry
test("FIX", t => {
  const assembly = [{ solid: fromPolygons({}, unitCubePolygons), tags: ['a'] },
                    { solid: fromPolygons({}, unitRegularTetrahedronPolygons), tags: ['b'] }];
  const solid = toSolid({ require: ['a'] }, assembly);
  writeFileSync('toSolid.test.simple.stl', solidToStla({}, solid));
  t.deepEqual(toGeneric(solid),
              [[[[0.5,-0.5,-0.5],[-0.5,-0.5,-0.5],[-0.5,0.5,-0.5],[0.5,0.5,-0.5]]],
               [[[0.5,-0.5,-0.5],[0.5,-0.5,0.5],[-0.5,-0.5,0.5],[-0.5,-0.5,-0.5]]],
               [[[-0.5,-0.5,-0.5],[-0.5,-0.5,0.5],[-0.5,0.5,0.5],[-0.5,0.5,-0.5]]],
               [[[-0.5,0.5,-0.5],[-0.5,0.5,0.5],[0.5,0.5,0.5],[0.5,0.5,-0.5]]],
               [[[0.5,0.5,-0.5],[0.5,0.5,0.5],[0.5,-0.5,0.5],[0.5,-0.5,-0.5]]],
               [[[0.5,0.5,0.5],[-0.5,0.5,0.5],[-0.5,-0.5,0.5],[0.5,-0.5,0.5]]]]);
});
*/

test('Both', t => {
  const assembly = [{ solid: fromPolygons({}, unitCubePolygons), tags: ['a'] },
                    { solid: fromPolygons({}, unitRegularTriangularPrismPolygons), tags: ['b'] }];
  const solid = toSolid({}, assembly);
  writeFileSync('toSolid.test.both.stl', solidToStla({}, solid));
  t.deepEqual(canonicalize(solid),
              [[[[-0.5, -0.86603, -0.5], [-0.5, -0.86603, 0.5], [-0.5, 0.86603, 0.5], [-0.5, 0.86603, -0.5]]],
               [[[0.13398, 0.5, -0.5], [-0.5, 0.86603, -0.5], [-0.5, 0.86603, 0.5], [0.13398, 0.5, 0.5]]],
               [[[1, 0, 0.5], [1, 0, -0.5], [0.5, 0.28868, -0.5], [0.5, 0.28868, 0.5]]],
               [[[0.13398, 0.5, 0.5], [0.5, 0.5, 0.5], [0.5, 0.5, -0.5], [0.13398, 0.5, -0.5]]],
               [[[0.5, 0.5, 0.5], [0.5, 0.28868, 0.5], [0.5, 0.28868, -0.5], [0.5, 0.5, -0.5]]],
               [[[0.13398, 0.5, -0.5], [0.5, 0.5, -0.5], [0.5, 0.28868, -0.5]]],
               [[[0.13398, 0.5, 0.5], [0.5, 0.28868, 0.5], [0.5, 0.5, 0.5]]],
               [[[-0.5, -0.86603, -0.5], [0.13398, -0.5, -0.5], [0.13398, -0.5, 0.5], [-0.5, -0.86603, 0.5]]],
               [[[0.5, -0.28868, -0.5], [1, 0, -0.5], [1, 0, 0.5], [0.5, -0.28868, 0.5]]],
               [[[0.5, -0.5, 0.5], [0.13398, -0.5, 0.5], [0.13398, -0.5, -0.5], [0.5, -0.5, -0.5]]],
               [[[0.5, -0.28868, 0.5], [0.5, -0.5, 0.5], [0.5, -0.5, -0.5], [0.5, -0.28868, -0.5]]],
               [[[0.13398, -0.5, 0.5], [0.5, -0.5, 0.5], [0.5, -0.28868, 0.5]]],
               [[[0.5, -0.28868, -0.5], [0.5, -0.5, -0.5], [0.13398, -0.5, -0.5]]],
               [[[-0.5, -0.86603, -0.5], [-0.5, 0.86603, -0.5], [1, 0, -0.5]]],
               [[[1, 0, 0.5], [-0.5, 0.86603, 0.5], [-0.5, -0.86603, 0.5]]]]);
});

test('Requires A', t => {
  const assembly = [{ solid: fromPolygons({}, unitCubePolygons), tags: ['a'] },
                    { solid: fromPolygons({}, unitRegularTriangularPrismPolygons), tags: ['b'] }];
  const solid = toSolid({ requires: ['b'] }, assembly);
  writeFileSync('toSolid.test.requiresA.stl', solidToStla({}, solid));
  t.deepEqual(canonicalize(solid),
              [[[[-0.5, -0.86603, -0.5], [-0.5, 0.86603, -0.5], [1, 0, -0.5]]],
               [[[-0.5, -0.86603, -0.5], [-0.5, -0.86603, 0.5], [-0.5, 0.86603, 0.5], [-0.5, 0.86603, -0.5]]],
               [[[-0.5, 0.86603, -0.5], [-0.5, 0.86603, 0.5], [1, 0, 0.5], [1, 0, -0.5]]],
               [[[1, 0, -0.5], [1, 0, 0.5], [-0.5, -0.86603, 0.5], [-0.5, -0.86603, -0.5]]],
               [[[1, 0, 0.5], [-0.5, 0.86603, 0.5], [-0.5, -0.86603, 0.5]]]]);
});

test('Excludes A', t => {
  const assembly = [{ solid: fromPolygons({}, unitCubePolygons), tags: ['a'] },
                    { solid: fromPolygons({}, unitRegularTriangularPrismPolygons), tags: ['b'] }];
  const solid = toSolid({ excludes: ['a'] }, assembly);
  writeFileSync('toSolid.test.excludesA.stl', solidToStla({}, solid));
  t.deepEqual(canonicalize(solid),
              [[[[-0.5, -0.86603, -0.5], [-0.5, 0.86603, -0.5], [1, 0, -0.5]]],
               [[[-0.5, -0.86603, -0.5], [-0.5, -0.86603, 0.5], [-0.5, 0.86603, 0.5], [-0.5, 0.86603, -0.5]]],
               [[[-0.5, 0.86603, -0.5], [-0.5, 0.86603, 0.5], [1, 0, 0.5], [1, 0, -0.5]]],
               [[[1, 0, -0.5], [1, 0, 0.5], [-0.5, -0.86603, 0.5], [-0.5, -0.86603, -0.5]]],
               [[[1, 0, 0.5], [-0.5, 0.86603, 0.5], [-0.5, -0.86603, 0.5]]]]);
});

test('Subassembly', t => {
  const assembly = [{ assembly: [{ solid: fromPolygons({}, unitCubePolygons), tags: ['a'] }] },
                    { solid: fromPolygons({}, unitRegularTriangularPrismPolygons), tags: ['b'] }];

  const solid = toSolid({ excludes: ['b'] }, assembly);
  writeFileSync('toSolid.test.excludesA.stl', solidToStla({}, solid));
  t.deepEqual(canonicalize(solid),
              [[[[0.13398, 0.5, -0.5], [0.5, 0.5, -0.5], [0.5, 0.28868, -0.5]]],
               [[[0.5, -0.28868, -0.5], [0.5, -0.5, -0.5], [0.13398, -0.5, -0.5]]],
               [[[0.5, -0.5, 0.5], [0.13398, -0.5, 0.5], [0.13398, -0.5, -0.5], [0.5, -0.5, -0.5]]],
               [[[0.13398, 0.5, 0.5], [0.5, 0.5, 0.5], [0.5, 0.5, -0.5], [0.13398, 0.5, -0.5]]],
               [[[0.5, 0.5, 0.5], [0.5, 0.28868, 0.5], [0.5, 0.28868, -0.5], [0.5, 0.5, -0.5]]],
               [[[0.5, -0.28868, 0.5], [0.5, -0.5, 0.5], [0.5, -0.5, -0.5], [0.5, -0.28868, -0.5]]],
               [[[0.13398, 0.5, 0.5], [0.5, 0.28868, 0.5], [0.5, 0.5, 0.5]]],
               [[[0.13398, -0.5, 0.5], [0.5, -0.5, 0.5], [0.5, -0.28868, 0.5]]],
               [[[0.5, -0.28868, 0.5], [0.5, -0.28868, -0.5], [0.13398, -0.5, -0.5], [0.13398, -0.5, 0.5]]],
               [[[0.5, 0.28868, 0.5], [0.13398, 0.5, 0.5], [0.13398, 0.5, -0.5], [0.5, 0.28868, -0.5]]]]);
});
