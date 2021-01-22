import { toRgbFromTags, toTagFromRgbInt } from './color.js';

import test from 'ava';

test('Default works.', (t) => {
  t.deepEqual(toRgbFromTags(['color/black']), [0, 0, 0]);
});

test('Blue works.', (t) => {
  t.deepEqual(toRgbFromTags(['color/blue']), [0, 0, 255]);
});

test('255 works.', (t) => {
  t.is(toTagFromRgbInt(255), 'color/#0000ff');
});

test('123214 works.', (t) => {
  t.is(toTagFromRgbInt(123214), 'color/#01e14e');
});
