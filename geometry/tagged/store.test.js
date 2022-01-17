import { load } from './load.js';
import { read } from '@jsxcad/sys';
import { store } from './store.js';
import test from 'ava';

test('Load and store', async (t) => {
  const original = {
    type: 'group',
    tags: 'foo',
    content: [{ type: 'group', tags: 'bar' }],
  };
  const stored = await store(original);
  t.deepEqual(
    {
      type: 'link',
      hash: 'F8uRTQ7YPwdySGXWAiKh4HoucIglBhKYkyJbhV5DYUU=',
    },
    stored
  );

  // Check what we actually stored for root geometry.
  t.deepEqual(
    {
      type: 'group',
      tags: 'foo',
      content: [
        { type: 'link', hash: 'ogfvjTzmTXpJZfrmMQYJEmw60A343JPNoo0pXLUc0Dw=' },
      ],
      hash: 'F8uRTQ7YPwdySGXWAiKh4HoucIglBhKYkyJbhV5DYUU=',
    },
    await read(`hash/${original.hash}`)
  );

  // Ensure that the round trip is completed.
  const loaded = await load(stored);
  t.deepEqual(
    {
      type: 'group',
      tags: 'foo',
      content: [
        {
          type: 'group',
          tags: 'bar',
          hash: 'ogfvjTzmTXpJZfrmMQYJEmw60A343JPNoo0pXLUc0Dw=',
        },
      ],
      hash: 'F8uRTQ7YPwdySGXWAiKh4HoucIglBhKYkyJbhV5DYUU=',
    },
    JSON.parse(JSON.stringify(loaded))
  );

  // Ensure that the sub-structural identities are maintained.
  const loadedAgain = await load(stored);
  t.is(loaded.content[0], loadedAgain.content[0]);
});
