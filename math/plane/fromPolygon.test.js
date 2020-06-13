import { fromPolygon } from './fromPolygon';
import test from 'ava';

test('Colinear points.', (t) => {
  // The first three points are colinear.
  const plane = fromPolygon([
    [-4, -4, -1],
    [0, -4, -1],
    [4, -4, -1],
    [4, -5, -1],
  ]);
  t.deepEqual(plane, [0, 0, -1, 1]);
});

test('Degenerate', (t) => {
  const plane = fromPolygon([
    [0.16591068104034595, -18.077097809025855, 0],
    [0.30991597596125525, -17.309113083487336, 0],
    [0.21982597323543568, -17.789565875554132, 0],
  ]);
  t.is(plane, undefined);
});
