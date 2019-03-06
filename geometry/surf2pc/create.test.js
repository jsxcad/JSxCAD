import { create } from './create';
import { test } from 'ava';

test('create: create() should return a new empty geometry', t => {
  const surface = create();
  t.deepEqual(surface.basePolygons, []);
  t.is(surface.isCanonicalized, true);
});
