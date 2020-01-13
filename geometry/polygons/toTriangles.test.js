import test from 'ava';
import { toTriangles } from './toTriangles';
import { unitSquarePolygon } from '@jsxcad/data-shape';

test('Triangulate a square.', t => {
  t.deepEqual(toTriangles({}, [unitSquarePolygon]),
              [[[0.5, 0.5, 0], [-0.5, 0.5, 0], [-0.5, -0.5, 0]],
               [[0.5, 0.5, 0], [-0.5, -0.5, 0], [0.5, -0.5, 0]]]);
});
