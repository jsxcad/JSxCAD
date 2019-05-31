import { create } from './create';
import { fromPoints } from './fromPoints';
import { origin } from './origin';
import test from 'ava';

test('line3: origin() should return proper origins', (t) => {
  const line1 = create();
  const org1 = origin(line1);
  t.deepEqual(org1, [0, 0, 0]);

  const line2 = fromPoints([1, 0, 0], [0, 1, 0]);
  const org2 = origin(line2);
  t.deepEqual(org2, [1, 0, 0]);

  const line3 = fromPoints([0, 1, 0], [1, 0, 0]);
  const org3 = origin(line3);
  t.deepEqual(org3, [0, 1, 0]);

  const line4 = fromPoints([0, 0, 6], [0, 6, 0]);
  const org4 = origin(line4);
  t.deepEqual(org4, [0, 0, 6]);

  const line5 = fromPoints([-5, -5, -5], [5, 5, 5]);
  const org5 = origin(line5);
  t.deepEqual(org5, [-5, -5, -5]);
});
