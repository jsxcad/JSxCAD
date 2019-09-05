import { cache, cacheTransform } from './cache';

import test from 'ava';

test('cache supports shallow equality', t => {
  const fooImpl = (a) => ({ a: 1 });
  const foo = cache(fooImpl);

  t.is(foo(1), foo(1));
  t.not(foo([1]), foo([1]));
  t.is(foo(2), foo(2));
  t.not(foo(1), foo(2));
});

test('cacheTransform supports deep equality of the first argument and shallow equality of the second', t => {
  const fooImpl = (a, b) => ({ a: 1, b: 1 });
  const foo = cacheTransform(fooImpl);

  t.is(foo([0], 1), foo([0], 1));
  t.not(foo([0], 1), foo([0], 2));
  t.not(foo([0], 1), foo([1], 1));
});
