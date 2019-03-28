import { blessAsTriangles } from './blessAsTriangles';
import { unitSquarePolygon } from '@jsxcad/data-shape';
import { toTriangles } from './toTriangles';
import { test } from 'ava';

test('Triangulate a square.', t => {
  t.deepEqual(toTriangles({}, [unitSquarePolygon]),
              blessAsTriangles([[[0.5, 0.5, 0], [-0.5, 0.5, 0], [-0.5, -0.5, 0]],
                                [[0.5, 0.5, 0], [-0.5, -0.5, 0], [0.5, -0.5, 0]]]));
});
