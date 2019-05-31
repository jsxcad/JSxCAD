import { fromXRotation } from './fromXRotation';
import { reallyQuantizeForSpace as q } from '@jsxcad/math-utils';
import test from 'ava';

test('mat4: fromXRotation() should return a new mat4 with correct values', (t) => {
  let rotation = 90 * 0.017453292519943295;

  const obs2 = fromXRotation(rotation);
  t.deepEqual(obs2.map(q), [1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1]);

  const obs3 = fromXRotation(-rotation);
  t.deepEqual(obs3.map(q), [1, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1]);
});
