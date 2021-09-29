import { keep } from './keep.js';
import test from 'ava';

test('Deep keep', (t) => {
  const group = {
    type: 'group',
    content: [
      { type: 'solid', solid: [], tags: ['plate'] },
      {
        type: 'group',
        content: [
          { type: 'solid', solid: [] },
          {
            type: 'group',
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
  const kept = keep(['void'], group);
  t.deepEqual(kept, {
    type: 'group',
    content: [
      { type: 'solid', solid: [], tags: ['type:void', 'plate'] },
      {
        type: 'group',
        content: [
          { type: 'solid', solid: [], tags: ['type:void'] },
          {
            type: 'group',
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
