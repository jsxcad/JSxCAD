import { fromPolygons as fromPolygonsToSolid, toGeneric } from '@jsxcad/geometry-solid';
import { fromSolid as fromSolidToBsp } from './fromSolid';
import test from 'ava';
import { toSolid as toSolidFromBsp } from './toSolid';

const cubePolygons = [[[-1, -1, -1], [-1, -1, 1], [-1, 1, 1], [-1, 1, -1]],
                      [[1, -1, -1], [1, 1, -1], [1, 1, 1], [1, -1, 1]],
                      [[-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1]],
                      [[-1, 1, -1], [-1, 1, 1], [1, 1, 1], [1, 1, -1]],
                      [[-1, -1, -1], [-1, 1, -1], [1, 1, -1], [1, -1, -1]],
                      [[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]]];

test('From solid to bsp to solid', t => {
  const inputSolid = fromPolygonsToSolid({}, cubePolygons);
  const bsp = fromSolidToBsp(inputSolid);
  const outputSolid = toSolidFromBsp(bsp);
  t.deepEqual(toGeneric(outputSolid),
              [[[[-1, -1, -1], [-1, -1, 1], [-1, 1, 1], [-1, 1, -1]]], [[[1, -1, -1], [1, 1, -1], [1, 1, 1], [1, -1, 1]]], [[[-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1]]], [[[-1, 1, -1], [-1, 1, 1], [1, 1, 1], [1, 1, -1]]], [[[-1, -1, -1], [-1, 1, -1], [1, 1, -1], [1, -1, -1]]], [[[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]]]]);
});
