import { keep } from './keep';
import test from 'ava';

test('Deep keep', (t) => {
  const assembly = {
    type: 'assembly',
    content: [
      { type: 'solid', solid: [], tags: ['plate'] },
      {
        type: 'assembly',
        content: [
          { type: 'solid', solid: [] },
          {
            type: 'assembly',
            content: [
              { type: 'solid', solid: [], tags: ['void'] },
              { type: 'solid', solid: [], tags: ['void'] },
              { type: 'solid', solid: [], tags: ['void'] },
            ],
          },
        ],
      },
    ],
  };
  const kept = keep(['void'], assembly);
  t.deepEqual(kept, {
    type: 'assembly',
    content: [
      { type: 'solid', solid: [], tags: ['compose/non-positive', 'plate'] },
      {
        type: 'assembly',
        content: [
          { type: 'solid', solid: [], tags: ['compose/non-positive'] },
          {
            type: 'assembly',
            content: [
              { type: 'solid', solid: [], tags: ['void'] },
              { type: 'solid', solid: [], tags: ['void'] },
              { type: 'solid', solid: [], tags: ['void'] },
            ],
          },
        ],
      },
    ],
  });
});
