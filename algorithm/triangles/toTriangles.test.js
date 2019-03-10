import { blessAsTriangles } from './blessAsTriangles';
import { unitSquare } from '@jsxcad/data-shape';
import { toTriangles } from './toTriangles';
import { test } from 'ava';

test('Triangulate a square.', t => {
  t.deepEqual(toTriangles({}, [unitSquare.unitSquarePolygon]),
              blessAsTriangles([[[0.5, 0.5, 0], [-0.5, 0.5, 0], [-0.5, -0.5, 0]],
                                [[0.5, 0.5, 0], [-0.5, -0.5, 0], [0.5, -0.5, 0]]]));
});
