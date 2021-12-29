import { hasNotTypeVoid, hasTypeVoid } from './type.js';

import test from 'ava';

test('Add', (t) => {
  t.deepEqual(hasTypeVoid({ tags: ['fish'] }), { tags: ['fish', 'type:void'] });
});

test('Remove', (t) => {
  t.deepEqual(hasNotTypeVoid({ tags: ['fish', 'type:void'] }), {
    tags: ['fish'],
  });
});
