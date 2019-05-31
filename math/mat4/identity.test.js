import { identity } from './identity';
import test from 'ava';

test('mat4: identity() should return a mat4 with correct values', (t) => {
  t.deepEqual(identity(), [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
});
