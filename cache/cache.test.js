import { cache, cacheTransform, clearCache } from './cache';

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

test('Test clearing the caches', t => {
  const fooImpl = (a) => [a];
  const foo = cache(fooImpl);

  const a = foo('a');

  // Memoization applies.
  t.is(foo('a'), a);

  clearCache();

  // Memoization has failed.
  t.not(foo('a'), a);

  // Memoization has resumed.
  t.is(foo('a'), foo('a'));
});
