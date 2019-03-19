import { angleDegrees } from './angleDegrees';
import { reallyQuantizeForSpace as q } from '@jsxcad/math-utils';
import { test } from 'ava';

test('vec2: angleDegrees() should return correct values', (t) => {
  t.is(q(angleDegrees([0, 0])), 0.0);
  t.is(q(angleDegrees([1, 2])), 63.43495);
  t.is(q(angleDegrees([1, -2])), -63.43495);
  t.is(q(angleDegrees([-1, -2])), -116.56505);
  t.is(q(angleDegrees([-1, 2])), 116.56505);
});
