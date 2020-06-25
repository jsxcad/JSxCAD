import { getLayers } from './getLayers';
import test from 'ava';

test('Simple', (t) => {
  const layers = getLayers({
    assembly: [
      { points: [[0, 0, 0]] },
      { layers: [{ points: [[1, 1, 1]] }, { points: [[2, 2, 2]] }] },
    ],
  });
  t.deepEqual(layers, [{ points: [[2, 2, 2]] }, { points: [[1, 1, 1]] }]);
});
