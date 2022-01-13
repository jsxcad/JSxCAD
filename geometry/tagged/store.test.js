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
  t.deepEqual(stored, {
    type: 'link',
    hash: '1GMMO3OWtQxbyS7MthYH7fELAX/Vj2r2YKdCoGMQgQE=',
  });

  // Check what we actually stored for root geometry.
  t.deepEqual(await read(`hash/${original.hash}`), {
    type: 'group',
    tags: 'foo',
    content: [
      { type: 'link', hash: 'ogfvjTzmTXpJZfrmMQYJEmw60A343JPNoo0pXLUc0Dw=' },
    ],
    hash: '1GMMO3OWtQxbyS7MthYH7fELAX/Vj2r2YKdCoGMQgQE=',
  });

  // Ensure that the round trip is completed.
  const loaded = await load(stored);
  t.deepEqual(JSON.parse(JSON.stringify(loaded)), {
    type: 'group',
    tags: 'foo',
    content: [
      {
        type: 'group',
        tags: 'bar',
        hash: 'ogfvjTzmTXpJZfrmMQYJEmw60A343JPNoo0pXLUc0Dw=',
      },
    ],
    hash: '1GMMO3OWtQxbyS7MthYH7fELAX/Vj2r2YKdCoGMQgQE=',
  });

  // Ensure that the sub-structural identities are maintained.
  const loadedAgain = await load(stored);
  t.is(loaded.content[0], loadedAgain.content[0]);
});
