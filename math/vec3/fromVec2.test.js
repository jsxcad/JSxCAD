import { fromVec2 } from './fromVec2';
import { test } from 'ava';

test('vec3: fromVec2() should return a new vec3 with correct values', (t) => {
  t.deepEqual(fromVec2([0, 0]), [0, 0, 0]);
  t.deepEqual(fromVec2([0, 1], -5), [0, 1, -5]);
});
