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
  t.deepEqual(stored, { hash: '0ea7c97c' });

  // Check what we actually stored for root geometry.
  t.deepEqual(await read(`hash/${original.hash}`), {
    type: 'group',
    tags: 'foo',
    content: [{ hash: '3e191b56' }],
    hash: '0ea7c97c',
    is_stored: true,
  });

  // Ensure that the round trip is completed.
  const loaded = await load(stored);
  t.deepEqual(loaded, {
    type: 'group',
    tags: 'foo',
    content: [
      {
        type: 'group',
        tags: 'bar',
        hash: '3e191b56',
        is_stored: true,
        is_loaded: true,
      },
    ],
    hash: '0ea7c97c',
    is_stored: true,
    is_loaded: true,
  });

  // Ensure that the sub-structural identities are maintained.
  const loadedAgain = await load(stored);
  t.is(loaded.content[0], loadedAgain.content[0]);
});
