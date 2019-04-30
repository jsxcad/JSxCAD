import { addTag } from './addTag';
import { test } from 'ava';

test('Simple', t => {
  t.deepEqual(addTag('x', {}), { tags: ['x'] });
});
