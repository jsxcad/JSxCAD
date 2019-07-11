import { fromPolygons, toString } from './bsp';

import { stringify } from 'flatted/esm';
import test from 'ava';

const cubePolygons = [[[-1, -1, -1], [-1, -1, 1], [-1, 1, 1], [-1, 1, -1]],
                      [[1, -1, -1], [1, 1, -1], [1, 1, 1], [1, -1, 1]],
                      [[-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1]],
                      [[-1, 1, -1], [-1, 1, 1], [1, 1, 1], [1, 1, -1]],
                      [[-1, -1, -1], [-1, 1, -1], [1, 1, -1], [1, -1, -1]],
                      [[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]]];

test('Build a BSP tree from a convex shape.', t => {
  const bsp = fromPolygons(cubePolygons);
  t.is(toString(bsp),
       '<BRANCH same: [[[-1,-1,-1],[-1,-1,1],[-1,1,1],[-1,1,-1]]] back: <BRANCH same: [[[1,-1,-1],[1,1,-1],[1,1,1],[1,-1,1]]] back: <BRANCH same: [[[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1]]] back: <BRANCH same: [[[-1,1,-1],[-1,1,1],[1,1,1],[1,1,-1]]] back: <BRANCH same: [[[-1,-1,-1],[-1,1,-1],[1,1,-1],[1,-1,-1]]] back: <BRANCH same: [[[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]]] back: <IN> front: <OUT>> front: <OUT>> front: <OUT>> front: <OUT>> front: <OUT>> front: <OUT>>');
});
