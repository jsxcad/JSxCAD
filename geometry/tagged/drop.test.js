import { drop } from './drop';
import test from 'ava';

test('Deep drop', (t) => {
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
  const dropped = drop(['void'], assembly);
  t.deepEqual(dropped, {
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
