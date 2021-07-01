import { drop } from './drop.js';
import test from 'ava';

test('Deep drop', (t) => {
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
  const dropped = drop(['void'], group);
  t.deepEqual(dropped, {
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
              {
                type: 'solid',
                solid: [],
                tags: ['compose/non-positive', 'void'],
              },
              {
                type: 'solid',
                solid: [],
                tags: ['compose/non-positive', 'void'],
              },
              {
                type: 'solid',
                solid: [],
                tags: ['compose/non-positive', 'void'],
              },
            ],
          },
        ],
      },
    ],
  });
});
