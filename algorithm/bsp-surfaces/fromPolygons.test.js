import { fromPolygons } from './fromPolygons';
import test from 'ava';

const cubePolygons = [[[-1, -1, -1], [-1, -1, 1], [-1, 1, 1], [-1, 1, -1]],
                      [[1, -1, -1], [1, 1, -1], [1, 1, 1], [1, -1, 1]],
                      [[-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1]],
                      [[-1, 1, -1], [-1, 1, 1], [1, 1, 1], [1, 1, -1]],
                      [[-1, -1, -1], [-1, 1, -1], [1, 1, -1], [1, -1, -1]],
                      [[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]]];

test('Build a BSP tree from a convex shape.', t => {
  const bsp = fromPolygons(cubePolygons);
  t.deepEqual(JSON.parse(JSON.stringify(bsp)),
              { 'back': { 'back': { 'back': { 'back': { 'back': { 'back': null, 'front': null, 'same': [[[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]]] }, 'front': null, 'same': [[[-1, -1, -1], [-1, 1, -1], [1, 1, -1], [1, -1, -1]]] }, 'front': null, 'same': [[[-1, 1, -1], [-1, 1, 1], [1, 1, 1], [1, 1, -1]]] }, 'front': null, 'same': [[[-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1]]] }, 'front': null, 'same': [[[1, -1, -1], [1, 1, -1], [1, 1, 1], [1, -1, 1]]] }, 'front': null, 'same': [[[-1, -1, -1], [-1, -1, 1], [-1, 1, 1], [-1, 1, -1]]] });
});
