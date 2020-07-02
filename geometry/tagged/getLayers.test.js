import { getLayers } from './getLayers.js';
import test from 'ava';

test('Simple', (t) => {
  const layers = getLayers({
    type: 'assembly',
    content: [
      { type: 'points', points: [[0, 0, 0]] },
      {
        type: 'layers',
        content: [
          { type: 'points', points: [[1, 1, 1]] },
          { type: 'points', points: [[2, 2, 2]] },
        ],
      },
    ],
  });
  t.deepEqual(layers, [
    { type: 'points', points: [[2, 2, 2]] },
    { type: 'points', points: [[1, 1, 1]] },
  ]);
});
