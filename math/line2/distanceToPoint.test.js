import { distanceToPoint } from './distanceToPoint';
import { fromPoints } from './fromPoints';
import { fromValues } from './fromValues';
import { reallyQuantizeForSpace as q } from '@jsxcad/math-utils';
import { test } from 'ava';

test('line2: distanceToPoint() should return proper values', (t) => {
  const line1 = fromValues();
  const dis1 = distanceToPoint([0, 0], line1);
  t.is(dis1, 0);
  const dis2 = distanceToPoint([1, 0], line1);
  t.is(dis2, 0);
  const dis3 = distanceToPoint([0, 1], line1);
  t.is(dis3, 1);

  const line2 = fromPoints([-5, 4], [5, -6]);
  const dis4 = distanceToPoint([0, 0], line2);
  t.is(q(dis4), 0.70711);
  const dis5 = distanceToPoint([1, 0], line2);
  t.is(q(dis5), 1.41421);
  const dis6 = distanceToPoint([2, 0], line2);
  t.is(q(dis6), 2.12132);
  const dis7 = distanceToPoint([3, 0], line2);
  t.is(q(dis7), 2.82843);
  const dis8 = distanceToPoint([4, 0], line2);
  t.is(q(dis8), 3.53553);
  const dis9 = distanceToPoint([5, 0], line2);
  t.is(q(dis9), 4.24264);
});
