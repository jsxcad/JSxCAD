import { create } from './create.js';
import { distanceToPoint } from './distanceToPoint.js';
import { fromPoints } from './fromPoints.js';
import { reallyQuantizeForSpace as q } from '@jsxcad/math-utils';
import test from 'ava';

test('line3: distanceToPoint() should return proper values', (t) => {
  const line1 = create();
  const dis1 = distanceToPoint([0, 0, 0], line1);
  t.is(q(dis1), 0);
  const dis2 = distanceToPoint([1, 0, 0], line1);
  t.is(q(dis2), 1);
  const dis3 = distanceToPoint([0, 1, 0], line1);
  t.is(q(dis3), 1);

  const line2 = fromPoints([-5, -5, -4], [5, 5, 6]);
  const dis4 = distanceToPoint([0, 0, 0], line2);
  t.is(q(dis4), 0.8165);
  const dis5 = distanceToPoint([1, 0, 0], line2);
  t.is(q(dis5), 1.41421);
  const dis6 = distanceToPoint([2, 0, 0], line2);
  t.is(q(dis6), 2.16025);
  const dis7 = distanceToPoint([3, 0, 0], line2);
  t.is(q(dis7), 2.94392);
  const dis8 = distanceToPoint([4, 0, 0], line2);
  t.is(q(dis8), 3.74166);
  const dis9 = distanceToPoint([5, 0, 0], line2);
  t.is(q(dis9), 4.54606);
});
