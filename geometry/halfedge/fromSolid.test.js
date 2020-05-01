/* @module */

import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import eachLink from './eachLink';
import fromSolid from './fromSolid';
import test from 'ava';
import toPlane from './toPlane';

const unitCube = [[[[0.5, -0.5, -0.5], [-0.5, -0.5, -0.5], [-0.5, 0.5, -0.5], [0.5, 0.5, -0.5]]], [[[0.5, -0.5, -0.5], [0.5, -0.5, 0.5], [-0.5, -0.5, 0.5], [-0.5, -0.5, -0.5]]], [[[-0.5, -0.5, -0.5], [-0.5, -0.5, 0.5], [-0.5, 0.5, 0.5], [-0.5, 0.5, -0.5]]], [[[-0.5, 0.5, -0.5], [-0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [0.5, 0.5, -0.5]]], [[[0.5, 0.5, -0.5], [0.5, 0.5, 0.5], [0.5, -0.5, 0.5], [0.5, -0.5, -0.5]]], [[[0.5, 0.5, 0.5], [-0.5, 0.5, 0.5], [-0.5, -0.5, 0.5], [0.5, -0.5, 0.5]]]];

test('Cube mesh', t => {
  const normalize = createNormalize3();
  const loops = fromSolid(unitCube, normalize);
  t.is(loops.length, 6);
  for (const loop of loops) {
    eachLink(loop,
             edge => {
               t.true(edge.next !== undefined);
               t.true(edge.twin !== undefined);
             });
  }
  t.deepEqual(toPlane(loops[0]), [ 0.4472135954999579, 0, -0.8944271909999159, 0.37267799624996495 ]);
});
