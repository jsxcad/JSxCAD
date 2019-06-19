import { fromPolygon } from './fromPolygon';
import test from 'ava';

test('Colinear points.', t => {
  // The first three points are colinear.
  const plane = fromPolygon([[-4, -4, -1], [0, -4, -1], [4, -4, -1], [4, -5, -1]]);
  t.deepEqual(plane, [0, 0, -1, 1]);
});
